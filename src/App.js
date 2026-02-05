import {useEffect, useState} from 'react';   // useState, useEffect 임포트
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import api from "./utils/api";    // api 임포트

function App() {
  const [todoList,setTodoList] = useState([]); // 데이터를 가져온 것을 저장하는 state가 필요

  const [todoValue,setTodoValue] = useState("");  // 입력한 값을 저장해야 함
  
  // todoList에서 값을 불러와서 넣는 작업이 필요함
  
  // 리스트를 불러오는 함수 작성 (getTasks 정의)
  const getTasks = async()=> {
    const response = await api.get('/tasks')
    console.log("rrrr",response);
    setTodoList(response.data.data); // setTodoList에 데이터 넣어주기 -> todoList에 아이템이 들어갈 것임
  };

  const addTask = async () => {
    try{
      const response = await api.post('/tasks', {
        task:todoValue,
        isComplete: false,
      });
      if(response.status===200){
        console.log('성공');
        //초기화
        setTodoValue("");
        // 새로고침해야 저장된 내용이 보임 -> getTasks 를 다시 불러와야 함
        getTasks();
      } else {
        throw new Error('task can not be added');
      }
    }catch(err) {
      console.log("error",err);
    }
  };


  const toggleComplete = async (id) => {
    try{
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status ===200) {
        getTasks();
      }
    }catch (error) {
      console.log("error",error);
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log(id);
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      }
    } catch (error) {
      console.log("error", error);
    }
  };



  // getTasks 호출 시기 (앱이 켜졌을 때 리스트가 보이도록 호출) -> UI가 그려지고 앱이 실행
  useEffect(()=>{
    getTasks();
  },[]);

  
  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            className="input-box"
            value={todoValue}
            onChange={(event) => setTodoValue(event.target.value)}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask}>추가</button>
        </Col>
      </Row>

      <TodoBoard 
        todoList={todoList}
        toggleComplete={toggleComplete}
        deleteItem={deleteItem}
      />  
    </Container>
  );
}

export default App;
