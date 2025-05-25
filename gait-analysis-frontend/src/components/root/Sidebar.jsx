//sidebar for root dashboard
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    ListItemIcon,
  } from "@mui/material";
  import BusinessIcon from "@mui/icons-material/Business";
  import DevicesIcon from "@mui/icons-material/Devices";
  import AssignmentIcon from "@mui/icons-material/Assignment";
  import { useNavigate } from "react-router-dom";
  
  const Sidebar = () => {
    const navigate = useNavigate();
  
    return (
      <Drawer variant="permanent">
        <List>
          <ListItemButton onClick={() => navigate("/admin/clinics")}>
            <ListItemIcon><BusinessIcon /></ListItemIcon>
            <ListItemText primary="Clinics" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate("/admin/sensor-kits")}>
            <ListItemIcon><DevicesIcon /></ListItemIcon>
            <ListItemText primary="Sensor Kits" />
          </ListItemButton>
          <ListItemButton onClick={() => navigate("/admin/assign-kits")}>
            <ListItemIcon><AssignmentIcon /></ListItemIcon>
            <ListItemText primary="Assign Kits" />
          </ListItemButton>
        </List>
      </Drawer>
    );
  };
  
  export default Sidebar;
  