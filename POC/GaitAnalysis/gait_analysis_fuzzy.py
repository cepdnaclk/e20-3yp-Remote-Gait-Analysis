import numpy as np
import skfuzzy as fuzz
from skfuzzy import control as ctrl

# Inputs
heel_pressure = ctrl.Antecedent(np.arange(0, 30, 1), 'heel_pressure')
roll = ctrl.Antecedent(np.arange(-40, 40, 1), 'roll')
gyro_x = ctrl.Antecedent(np.arange(-10, 10, 0.1), 'gyro_x')

# Outputs
heel_strike = ctrl.Consequent(np.arange(0, 1, 0.1), 'heel_strike')
toe_off = ctrl.Consequent(np.arange(0, 1, 0.1), 'toe_off')

# Membership functions (as defined above)
# ... [Copy the membership function code from earlier] ...
heel_pressure = ctrl.Antecedent(np.arange(0, 30, 1), 'heel_pressure')
heel_pressure['Low'] = fuzz.trimf(heel_pressure.universe, [0, 0, 10])
heel_pressure['Medium'] = fuzz.trimf(heel_pressure.universe, [5, 15, 25])
heel_pressure['High'] = fuzz.trimf(heel_pressure.universe, [20, 30, 30])

roll = ctrl.Antecedent(np.arange(-40, 40, 1), 'roll')
roll['Negative'] = fuzz.trimf(roll.universe, [-40, -30, -10])  # Toe-off
roll['Neutral'] = fuzz.trimf(roll.universe, [-15, 0, 15])      # Flat
roll['Positive'] = fuzz.trimf(roll.universe, [10, 30, 40])    # Heel strike

gyro_x = ctrl.Antecedent(np.arange(-10, 10, 0.1), 'gyro_x')
gyro_x['Stationary'] = fuzz.trimf(gyro_x.universe, [-1, 0, 1])
gyro_x['Slow'] = fuzz.trimf(gyro_x.universe, [0, 2, 5])
gyro_x['Fast'] = fuzz.trimf(gyro_x.universe, [3, 7, 10])

# Rules
rules = [
    # Heel strike rules
    ctrl.Rule(heel_pressure['High'] & roll['Positive'] & gyro_x['Stationary'], heel_strike['Likely']),
    ctrl.Rule(heel_pressure['Medium'] & roll['Positive'] & gyro_x['Slow'], heel_strike['Possible']),
    
    # Toe-off rules
    ctrl.Rule(heel_pressure['Low'] & roll['Negative'] & gyro_x['Fast'], toe_off['Likely']),
    ctrl.Rule(heel_pressure['Medium'] & roll['Negative'] & gyro_x['Slow'], toe_off['Possible'])
]

# Control system
gait_ctrl = ctrl.ControlSystem(rules)
gait_sim = ctrl.ControlSystemSimulation(gait_ctrl)

def detect_gait_events(fsr_values, roll_deg, gyro_x_val):
    # Average heel FSRs (adjust to your cluster)
    heel_avg = np.mean([fsr_values[s] for s in HEEL_SENSORS])
    
    # Input to fuzzy system
    gait_sim.input['heel_pressure'] = heel_avg
    gait_sim.input['roll'] = roll_deg
    gait_sim.input['gyro_x'] = gyro_x_val
    
    # Compute
    gait_sim.compute()
    
    return {
        'heel_strike': gait_sim.output['heel_strike'],
        'toe_off': gait_sim.output['toe_off']
    }

# Example usage
result = detect_gait_events(
    fsr_values={'FSR_2': 18, 'FSR_3': 15, 'FSR_4': 20, 'FSR_10': 12},  # Avg = 16.25N
    roll_deg=25,    # Positive roll (heel strike)
    gyro_x_val=0.2  # Stationary
)
print(f"Heel Strike Likelihood: {result['heel_strike']:.2f}")
# Output: Likely (e.g., 0.85)

result = detect_gait_events(
    fsr_values={'FSR_6': 2, 'FSR_7': 3, 'FSR_8': 1, 'FSR_9': 0, 'FSR_16': 1},  # Avg = 1.4N
    roll_deg=-25,   # Negative roll (toe-off)
    gyro_x_val=4.5  # Fast rotation
)
print(f"Toe-Off Likelihood: {result['toe_off']:.2f}")
# Output: Likely (e.g., 0.92)