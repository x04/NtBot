import React from 'react';
import PropTypes from 'prop-types'
import memoize from 'memoize-one';
import { FixedSizeList as List } from 'react-window';
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import global from "../global";
import Table from "@material-ui/core/Table";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import TableHead from "@material-ui/core/TableHead";
import withStyles from "@material-ui/core/styles/withStyles";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

class RowComponent extends React.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.props.style !== nextProps.style) {
            return true
        }

        const curItem = this.props.data.items[this.props.index];
        const nextItem = nextProps.data.items[nextProps.index];
        if (curItem !== nextItem) {
            return true
        }

        const curIsSelected = this.props.data.selected.some(id => id === curItem.Id);
        const nextIsSelected = nextProps.data.selected.some(id => id === nextItem.Id);
        return curIsSelected !== nextIsSelected;
    }

    render() {
        const { items, selected, toggleItemActive } = this.props.data;
        const item = items[this.props.index];
        const isActive = selected.some(id => id === item.Id);

        return (
                <TableRow
                    style={this.props.style}
                    hover
                    onClick={_ => toggleItemActive(item.Id)}
                    role="checkbox"
                    aria-checked={isActive}
                    tabIndex={-1}
                    key={item.Id}
                    selected={isActive}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={isActive}
                            inputProps={{ 'aria-labelledby': item.Id }}
                        />
                    </TableCell>
                    <TableCell component="th" id={item.Id} scope="row">
                        {item.Id}
                    </TableCell>
                    <TableCell>{item.Type}</TableCell>
                    <TableCell>{item.SearchProduct.ProductKeywords.join(", ")}</TableCell>
                    <TableCell>{item.SearchProduct.StyleKeywords.join(", ")}</TableCell>
                    <TableCell>{item.SearchProduct.SizeKeywords.join(", ")}</TableCell>
                    <TableCell>{item.BillingProfile.Name}</TableCell>
                    <TableCell>{item.Proxy === "" ? "n/a" : item.Proxy}</TableCell>
                    <TableCell>{item.Status}</TableCell>
                    <TableCell>{item.Completed}</TableCell>
                </TableRow>
        );
    }
}

// This helper function memoizes incoming props,
// To avoid causing unnecessary re-renders pure Row components.
// This is only needed since we are passing multiple props with a wrapper object.
// If we were only passing a single, stable value (e.g. items),
// We could just pass the value directly.
const createItemData = memoize((items, selected, toggleItemActive) => ({
    items,
    selected,
    toggleItemActive,
}));

// In this example, "items" is an Array of objects to render,
// and "toggleItemActive" is a function that updates an item's state.
function TaskList({ height, items, selected, toggleItemActive, selectAll, classes }) {

    // Bundle additional data to list items using the "itemData" prop.
    // It will be accessible to item renderers as props.data.
    // Memoize this data to avoid bypassing shouldComponentUpdate().
    const itemData = createItemData(items, selected, toggleItemActive);

    return (
            <Table
                className={classes.table}
                aria-labelledby="tasksTable"
                size="medium"
                aria-label="tasks table"
            >
                <TaskTableHead
                    classes={classes}
                    onSelectAllClick={selectAll}
                    rowCount={items.length}
                    numSelected={selected.length}
                />
                <TableBody>
                    <AutoSizer disableHeight>
                        {({ width }) => (
                            <List
                                height={height}
                                width={width}
                                itemCount={items.length}
                                itemData={itemData}
                                itemSize={53.33}
                            >
                                {RowComponent}
                            </List>
                        )}
                    </AutoSizer>
                </TableBody>
            </Table>
    );
}

const headCells = [
    { id: 'id', label: 'ID' },
    { id: 'type', label: 'Type' },
    { id: 'product', label: 'Product Keywords' },
    { id: 'style', label: 'Style Keywords' },
    { id: 'size', label: 'Size Keywords' },
    { id: 'billing', label: 'Billing Profile' },
    { id: 'proxy', label: 'Proxy' },
    { id: 'status', label: 'Status' },
    { id: 'completed', label: 'Completed' },
];

function TaskTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all tasks' }}
                    />
                </TableCell>
                {headCells.map(headCell => (
                    <TableCell key={headCell.id}>
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

TaskTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
    },
    title: {
        flex: '1 1 100%',
    },
}));

const TaskToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected, addTask, duplicateTasks, removeSelectedTasks, removeTasks, runSelectedTasks, runAllTasks } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle">
                    Tasks
                </Typography>
            )}

            {numSelected > 0 ? (
                <div style={{display: "inline-flex"}}>
                    <Tooltip title="Run Selected">
                        <IconButton onClick={runSelectedTasks} aria-label="run">
                            <PlayArrowIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Duplicate Selected">
                        <IconButton onClick={duplicateTasks} aria-label="run">
                            <FileCopyIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton onClick={removeSelectedTasks} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            ) : (
                <div style={{display: "inline-flex"}}>
                    <Tooltip title="Run All">
                        <IconButton onClick={runAllTasks} aria-label="run all">
                            <SkipNextIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Add">
                        <IconButton onClick={() => {
                            window.astilectron.sendMessage({"name": "addTask"}, addTask);
                        }} aria-label="add">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete All">
                        <IconButton onClick={removeTasks} aria-label="delete all">
                            <DeleteForeverIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </Toolbar>
    );
};

TaskToolbar.propTypes = {
    numSelected: PropTypes.array.isRequired,
    addTask: PropTypes.func.isRequired,
    duplicateTasks: PropTypes.func.isRequired,
    removeTasks: PropTypes.func.isRequired,
    removeSelectedTasks: PropTypes.func.isRequired,
    runSelectedTasks: PropTypes.func.isRequired,
    runAllTasks: PropTypes.func.isRequired,
};

const useStyles = () => ({
    root: {
        flex: '1 1 auto',
        width: '100%',
    },
    paper: {
        width: '100%',
        height: 'calc(100vh - 48px)',
    },
    table: {
        minWidth: 750,
    },
});

class TaskListComponent extends React.PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            items: [],
            selected: [],
        };

        this.classes = props.classes;

        global["handlers"]["updateTask"] = (newTask) => {
            let newItems = this.state.items.concat();
            let index = newItems.findIndex(task => task.Id === newTask.Id);
            newItems[index] = newTask;
            this.setState(prevState => {
                return {
                    items: newItems,
                    selected: prevState.selected,
                }
            })
        }
    }

    toggleItemActive = id =>
        this.setState(prevState => {
            const selectedIndex = this.state.selected.indexOf(id);
            let newSelected = [];

            if (selectedIndex === -1) {
                newSelected = newSelected.concat(this.state.selected, id);
            } else if (selectedIndex === 0) {
                newSelected = newSelected.concat(this.state.selected.slice(1));
            } else if (selectedIndex === this.state.selected.length - 1) {
                newSelected = newSelected.concat(this.state.selected.slice(0, -1));
            } else if (selectedIndex > 0) {
                newSelected = newSelected.concat(
                    this.state.selected.slice(0, selectedIndex),
                    this.state.selected.slice(selectedIndex + 1),
                );
            }

            return {
                items: prevState.items,
                selected: newSelected,
            };
        });

    addTask = msg => {
        this.setState(prevState => {
            return {
                items: [...this.state.items, msg.payload],
                selected: prevState.selected,
            }
        })
    };

    removeSelectedTasks = () => {
        this.setState(prevState => {
            return {
                items: prevState.items.filter(task => {
                    if (prevState.selected.some(id => id === task.Id)) {
                        window.astilectron.sendMessage({"name": "deleteTask", "payload": task.Id});
                        return false
                    }

                    return true
                }),
                selected: [],
            }
        })
    };

    removeAllTasks = () => {
        this.setState(prevState => {
            prevState.items.forEach(task => {
                window.astilectron.sendMessage({"name": "deleteTask", "payload": task.Id});
            });

            return {
                items: [],
                selected: [],
            }
        })
    };

    duplicateSelectedTasks = () => {
        this.state.selected.forEach(id => {
            window.astilectron.sendMessage({"name": "duplicateTask", "payload": id}, msg => {
                this.addTask(msg)
            });
        });
    };

    runTask = id => {
        window.astilectron.sendMessage({"name": "runTask", "payload": id});
    };

    runAllTasks = () => {
        this.state.items.forEach(task => {
            window.astilectron.sendMessage({"name": "runTask", "payload": task.Id});
        });
    };

    runSelectedTasks = () => {
        this.state.selected.forEach(taskId => {
            window.astilectron.sendMessage({"name": "runTask", "payload": taskId});
        });
    };

    selectAll = () => {
        if (this.state.items.length !== this.state.selected.length) {
            const newSelected = this.state.items.map(n => n.Id);
            this.setState(prevState => {
                return {
                    items: prevState.items,
                    selected: newSelected,
                }
            });
            return;
        }
        this.setState(prevState => {
            return {
                items: prevState.items,
                selected: [],
            }
        });
    };

    render() {
        return (
            <div className={this.classes.root}>
                <Paper className={this.classes.paper}>
                    <TaskToolbar
                        numSelected={this.state.selected.length}
                        addTask={this.addTask}
                        duplicateTasks={this.duplicateSelectedTasks}
                        removeTasks={this.removeAllTasks}
                        removeSelectedTasks={this.removeSelectedTasks}
                        runSelectedTasks={this.runSelectedTasks}
                        runAllTasks={this.runAllTasks}
                    />
                    <div>
                    <TaskList
                        height={500}
                        classes={this.classes}
                        items={this.state.items}
                        selected={this.state.selected}
                        toggleItemActive={this.toggleItemActive}
                        selectAll={this.selectAll}
                    />
                    </div>
                </Paper>
            </div>
        );
    }
}

export default withStyles(useStyles)(TaskListComponent)