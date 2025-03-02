import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'dart:async';

void main() {
  FlutterBluePlus.setLogLevel(LogLevel.verbose, color: false);
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ESP32 BLE Sensor',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: SensorScreen(),
    );
  }
}

class SensorScreen extends StatefulWidget {
  @override
  _SensorScreenState createState() => _SensorScreenState();
}

class _SensorScreenState extends State<SensorScreen> {
  final FlutterBluePlus flutterBlue = FlutterBluePlus();
  BluetoothDevice? esp32Device;
  BluetoothCharacteristic? characteristic;
  List<int> sensorData = List.filled(16, 0);
  bool isConnected = false;
  List<BluetoothDevice> availableDevices = [];

  final String SERVICE_UUID = "12345678-1234-5678-1234-56789abcdef0";
  final String CHARACTERISTIC_UUID = "abcdef01-1234-5678-1234-56789abcdef1";

  @override
  void initState() {
    super.initState();
  }

  void scanForDevices() async {
    print("🔍 Starting Bluetooth Scan...");
    availableDevices.clear();
    await FlutterBluePlus.adapterState
        .where((state) => state == BluetoothAdapterState.on)
        .first;

    var subscription = FlutterBluePlus.onScanResults.listen((results) {
      for (ScanResult r in results) {
        if (!availableDevices.contains(r.device)) {
          availableDevices.add(r.device);
          print(
            "📡 Found device: ${r.device.name.isNotEmpty ? r.device.name : r.device.remoteId}",
          );
          setState(() {});
        }
      }
    }, onError: (e) => print("❌ Scan Error: $e"));

    FlutterBluePlus.cancelWhenScanComplete(subscription);

    await FlutterBluePlus.startScan(timeout: Duration(seconds: 15));

    await FlutterBluePlus.isScanning.where((val) => val == false).first;
  }

  void connectToDevice() async {
    if (esp32Device == null) return;
    print("🔄 Connecting to ${esp32Device!.remoteId}...");
    try {
      await esp32Device!.connect(timeout: Duration(seconds: 10));
      print("✅ Connected to ESP32!");
      discoverServices();
    } catch (e) {
      print("❌ Connection failed: $e");
    }
  }

  void discoverServices() async {
    if (esp32Device == null) return;
    List<BluetoothService> services = await esp32Device!.discoverServices();
    for (var service in services) {
      if (service.uuid.toString() == SERVICE_UUID) {
        for (var c in service.characteristics) {
          if (c.uuid.toString() == CHARACTERISTIC_UUID) {
            characteristic = c;
            characteristic!.setNotifyValue(true);
            characteristic!.onValueReceived.listen((value) {
              updateSensorData(value);
            });
            setState(() => isConnected = true);
          }
        }
      }
    }
  }

  void updateSensorData(List<int> value) {
    if (value.length == 32) {
      for (int i = 0; i < 16; i++) {
        sensorData[i] = value[i * 2] + (value[i * 2 + 1] << 8);
      }
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("ESP32 Sensor Data")),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(
              isConnected ? "✅ Connected to ESP32" : "❌ Not Connected",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: scanForDevices,
              child: Text("🔍 Scan for Devices"),
            ),
            SizedBox(height: 10),
            DropdownButton<BluetoothDevice>(
              hint: Text("Select a Device"),
              items:
                  availableDevices.map((device) {
                    return DropdownMenuItem<BluetoothDevice>(
                      value: device,
                      child: Text(
                        device.name.isNotEmpty
                            ? device.name
                            : device.remoteId.toString(),
                      ),
                    );
                  }).toList(),
              onChanged: (device) {
                if (device != null) {
                  esp32Device = device;
                  connectToDevice();
                }
              },
            ),
            Expanded(
              child: GridView.builder(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                ),
                itemCount: sensorData.length,
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 4,
                    child: Center(
                      child: Text(
                        "${sensorData[index]}",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
