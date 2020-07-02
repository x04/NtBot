import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MinimizeIcon from '@material-ui/icons/Minimize';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import CancelIcon from '@material-ui/icons/Cancel';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import SettingsIcon from '@material-ui/icons/Settings';
import PaymentIcon from '@material-ui/icons/Payment';
import AppBar from "@material-ui/core/AppBar";
import Tasks from "./pages/tasks";
import Profiles from "./pages/profiles";
import Settings from "./pages/settings";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import NtLogo from "./nt-logo.png";

const theme = createMuiTheme({
    palette: {
        type: "dark",
        secondary: {
            main: '#af0404',
        },
    },
    overrides: {
        MuiTableSortLabel: {
            icon: {
                left: '100%',
                position: 'absolute',
            }
        }
    },
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
        style: {"-webkit-app-region": "no-drag"}
    };
}

const useStyles = makeStyles(() => ({
    '@global': {
        '*::-webkit-scrollbar': {
            width: '0.4em'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey'
        }
    },
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background,
    },
    appBar: {
        backgroundColor: '#252525',
        "-webkit-app-region": "drag",
    },
    actionButtons: {
        position: "absolute",
        right: "0",
        marginRight: "10px",
        "-webkit-app-region": "no-drag",
    },
    actionButton: {
        borderRadius: 0,
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <div className={classes.root}>
                <AppBar className={classes.appBar} position="static">
                    <Toolbar style={{padding: "0", minHeight: "48px"}}>
                        <img src={NtLogo} alt={"Nt Logo"} height={"48px"} />
                        <div className={classes.actionButtons}>
                            <IconButton className={classes.actionButton} disableRipple={true} onClick={() => { window.astilectron.sendMessage({"name": "minimize"}) }}>
                                <MinimizeIcon />
                            </IconButton>
                            <IconButton className={classes.actionButton} disableRipple={true} onClick={() => { window.astilectron.sendMessage({"name": "maximize"}) }}>
                                <AspectRatioIcon />
                            </IconButton>
                            <IconButton className={classes.actionButton} disableRipple={true} onClick={() => { window.astilectron.sendMessage({"name": "close"}) }}>
                                <CancelIcon />
                            </IconButton>
                        </div>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="navigation"
                            style={{"margin": "auto"}}
                        >
                            <Tab icon={<FormatListBulletedIcon/>} aria-label="tasks" {...a11yProps(0)} />
                            <Tab icon={<PaymentIcon/>} aria-label="profiles" {...a11yProps(1)} />
                            <Tab icon={<SettingsIcon/>} aria-label="settings" {...a11yProps(2)} />
                        </Tabs>
                    </Toolbar>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <Tasks />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Profiles />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Settings />
                </TabPanel>
            </div>
        </MuiThemeProvider>
    );
};