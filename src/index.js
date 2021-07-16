import React, { useState } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const storingLocation = "https://localhost:5001/api/TodoItems";

function addData(item){
	fetch(storingLocation, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item)
	})
}

function todoToItem(todo){
	const randNum = Math.floor(Math.random()*10000);
	return {name: todo, iid: randNum, RowKey: String(randNum), PartitionKey: "TodoList"};
}

function deleteData(id){
	fetch(`${storingLocation}/${id}`, {
		method: 'DELETE'
	});
}

const useStyle = makeStyles({
	card: {
		margin: "50px",
		minWidth: 1000,
		borderRadius: 10,
		border: "2px solid",
		align: 'center'
	}
})

function ToDoEvent(props){
	const classes = useStyle();
	return (
		<div>
		<Card className={classes.card} variant='outlined'>
			<Typography align='center' variant = 'h4'>
				{props.content}
			</Typography>
			<Button 
				variant='contained'
				color='secondary'
				onClick={() => props.complete(props.index)}> 
				<Typography variant='h6'>
					Delete
				</Typography>
			</Button>
		</Card>
		</div>
	)
}

function ToDoInput(props){
	const[input, setInput] = useState('');
	const handleSubmit = e => {
		e.preventDefault();
		props.add(input);
		setInput('');
	}
	const handleChange = e => {
		setInput(e.target.value);
	}
	return (
		<form onSubmit = {handleSubmit}>
		<TextField variant='outlined' label = 'Add Event' fullWidth={true} value={input} margin='normal' onChange={handleChange}/>
			<Button fullWidth={true} variant='contained' color='primary'> Submit </Button>
		</form>
	);
}

function ToDoList (props){
	return (
		props.list.map((content, index) => (
			<ToDoEvent 
				content={content.name} 
				index = {content.iid}
				key={content.iid} 
				complete={props.complete}
			/>)
		)
	);
}

function EntireToDoList(){
	const[toDoList, setToDoList] = useState([]);
	fetch(storingLocation)
	.then(response => response.json())
	.then(data => setToDoList(data)); 
	
	const addToDo = toDo => {
		//setToDoList([...toDoList, toDo]);
		addData(todoToItem(toDo));
	}
	const deleteIndex = index => {
		/*const newToDoList = [...toDoList];
		newToDoList.splice(index,1);
		setToDoList(newToDoList);*/
		deleteData(index);
	}
	return (
		<div>
			<ToDoInput add={addToDo}/>
            <div>
                <ToDoList list={toDoList} complete={deleteIndex}/>
            </div>
		</div>
	);
}

ReactDOM.render(
	<EntireToDoList/>,
	document.getElementById('root')
);