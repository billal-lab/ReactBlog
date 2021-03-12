import React, {Component} from 'react';
import axios from 'axios';

export default class New extends Component {

    constructor(){
        super();
        this.state = {
            fields:{
                title:"",
                selectedFile:null,
                description:"",
            },
            errors:{},
            clean:false
        }
        this.textInput = React.createRef();
        this.textAreaInput = React.createRef();
        this.onClickHandler = this.onClickHandler.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onUpload = (event)=>{
        const file = event.target.files[0];
        var fields = this.state.fields
        fields.selectedFile = file
        this.setState({
            fields: fields
        })
        console.log(this.state.fields)
    }

    onChangeHandler = (event)=>{
        var name = event.target.name;
        var value = event.target.value;

        var errors = this.state.errors;
        errors[name]= undefined;

        var fields = this.state.fields;
        fields[name] = value;

        this.setState({
            fields: fields,
            errors: errors
        })
    }

    componentDidMount(){
        if(this.props.match){
            axios.get(`http://localhost:8000/api/publication/${this.props.match.params.id}`)
                .then(response => {this.setState({fields: response.data})})
        }
    }

    static getDerivedStateFromProps(props, state){ //The getDerivedStateFromProps() method is called right before rendering the element(s) in the DOM
        if(!props.match){
            if(state.clean!=true){
                state = {
                    fields:{
                        title:"",
                        selectedFile:null,
                        description:""
                    },
                    clean:true
                }
            }
        }
        return state
    }

    onClickHandler (event){
        event.preventDefault();
        var isvalid =true;
        var errors = this.state.errors
        if(this.state.fields.title==""){
            errors["title"] = "please enter a title",
            isvalid=false;
            this.animate(this.textInput);
        }
        if(this.state.fields.description==""){
            errors["description"] = "please enter a description";
            isvalid=false;
            this.animate(this.textAreaInput);
        }
        this.setState({
            errors: errors
        })
        if(isvalid){
            if(this.props.match){
                this.putRequest()
            }else{
                this.postRequest()
            }
        }
    }


    animate(ref){
        var list = ["rotate(2deg)", "rotate(-2deg)"]
        var i=0;
        var interval = setInterval(() =>{
            (ref.current.style.transform = list[i%2] );
            if(i>5){
                ref.current.style.transform=""
                clearInterval(interval);
            }
            i++;
        },100);
    }


    postRequest(){
        const data = new FormData();
        data.append("title", this.state.fields.title)
        data.append("description", this.state.fields.description)
        data.append("file", this.state.fields.selectedFile)
        axios.post("http://localhost:8000/api/publication/new",data)
                .then(response => {
                    console.log(response)
                    if(response.status==200){
                        this.setState({
                            fields: {
                                title:"",
                                selectedFile:null,
                                description:""
                            }
                        })
                        var elm = document.querySelector('#alert')
                        elm.style.left="100px";
                        setTimeout(() => elm.style.left="0px",300)
                        setTimeout(()=> this.hidAlert(), 3000);
                    }
                })
    }

    putRequest(){
        axios.put(`http://localhost:8000/api/publication/${this.props.match.params.id}/edit`,this.state.fields)
            .then(response => {
                if(response.status==200){
                    var elm = document.querySelector('#alert')
                    elm.style.left="100px";
                    setTimeout(() => elm.style.left="0px",300)
                    setTimeout(()=> this.hidAlert(), 3000);
                }
            })
    }
    hidAlert(){
        var elm = document.querySelector('#alert')
        elm.style.left="100px";
        setTimeout(() => elm.style.left="-1500px",300)
    }
    render() {
        var style ={position:"relative", transition: "0.1s"}
        return (
            <div className="">
                <div id="alert" onClick={this.hidAlert.bind(this)} className="row justify-content-center" style={{left: "-1500px", transition: "0.3s", position:"relative"}} >
                    <div className="col-6 alert alert-success text-center" role="alert">
                        Success !
                    </div>
                </div>

                <form className="row justify-content-center">
                    <div className="form-group col-6">
                        <div style={style} ref={this.textInput}>
                            <label>Title : </label>
                            <span className="mx-2 text-danger">{this.state.errors["title"]}</span>
                            <input className={this.state.errors.title !=undefined? "form-control mb-2 border-danger" : "form-control mb-2"} id="title" rows="3" name="title" onChange={this.onChangeHandler} value={this.state.fields.title}/>
                        </div>
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" name="file" id="validatedCustomFile" onChange={this.onUpload.bind(this)} />
                            <label className="custom-file-label">Choose file...</label>
                            <div className="invalid-feedback">Example invalid custom file feedback</div>
                        </div>
                        <div style={style} ref={this.textAreaInput}>
                            <label>Description : </label>
                            <span className="text-danger mx-2">{this.state.errors["description"]}</span>
                            <textarea className={this.state.errors.description != undefined? "form-control mb-2 border-danger" : "form-control mb-2"} id="description" name="description" rows="4" onChange={this.onChangeHandler} value={this.state.fields.description}/>
                        </div>
                        <button onClick={this.onClickHandler} className="btn btn-primary btn-block form-control">{this.props.match ? "EDIT" : "Create"}</button>
                    </div>
                </form>
            </div>
        );
    }
}