import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export default class Publications extends Component {
    constructor(){
        super();
        this.state = {
            data:null,
            selected:null
        }
        this.listCards = this.listCards.bind(this)
        this.image = React.createRef();
    }
    componentDidMount(){
        axios.get("http://localhost:8000/api/publication/")
            .then((reponse)=>(this.load(reponse.data)))
    }

    load(data){
        this.setState({
            data:data
        })
    }

    OnMouseleaveHandler(id){
        document.getElementById(id).style.opacity="1";
    }

    onHoverHandler(id){
        document.getElementById(id).style.opacity = "0.5";
        this.setState({
            selected:id
        })
    }

    clickTrashHandler(i){
        if(confirm("do you want really delete this publications ?")){
            axios.delete(`http://localhost:8000/api/publication/${i}`)
            .then((response)=>{
                if (response.status === 200) {
                    this.setState({
                        data: this.state.data.filter(item => item.id != i)
                    })
                }
            })
        }
    }

    display(i){
        return (
            <div className="">
                <i className="fas fa-trash" style={{color:"black"}} onClick={this.clickTrashHandler.bind(this,i)} onMouseOver={(event)=>(event.target.classList.add("text-danger"), event.target.style.transform = "scale(1.2)")} onMouseOut={(event)=>(event.target.classList.remove("text-danger"), event.target.style.transform="")} ></i>
                <Link style={{color:"black"}} to={`/publication/${i}/edit`}>
                    <i className="fas fa-edit mx-4"   onMouseOver={(event)=>(event.target.classList.add("text-primary"),event.target.style.transform = "scale(1.2)")} onMouseOut={(event)=>(event.target.classList.remove("text-primary"), event.target.style.transform="")} ></i>
                </Link>
            </div>
        );
    }
    
    card(item){
        return(
            <div key={item.id} className="card col-4 mx-1 mt-2 bg-light" onMouseOver={(this.onHoverHandler.bind(this,item.id))} onMouseLeave={(this.OnMouseleaveHandler.bind(this,item.id))} style={{width: "400px"}}>
                <img id={item.id} className="card-img-top"
                    src = {item.imageFileName == null ? "http://localhost:8000/uploads/brochures/test.jpg" : `http://localhost:8000/uploads/brochures/${item.imageFileName}` }
                    alt="Card image cap" ref={this.image}>  
                </img>
                <div className="card-img-overlay">
                    <div className="mx-2">
                        {this.state.selected == item.id ? this.display(item.id) : "" } 
                    </div>
                </div>
                <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                </div>
            </div>
        );
    }

    listCards(){
        return(
            <div className="row justify-content-center">
                {this.state.data.map((item)=>(this.card(item)))}
            </div>
        );
    }

    render() {
        if(this.state.data!=null){
            return (
                <div className="cantainer">
                    {this.listCards()}
                </div>
            );
        }
        return (
            <div className="row justify-content-center">
                <div className="spinner-border text-muted"></div>
            </div>
        );
    }
}