import React, { Component } from 'react';


class ProfileRegistration extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      email: props.email,
      accessToken: props.accessToken,
      idToken: props.idToken,
      username: props.username,
      handleProfileCreated: props.handleProfileCreated,
      firstName: null,
      lastName: null,
      displayName: null,
      areaOfInterest: null,
      department: null,
      teams: null,
      title: null,
      skills: null,
    }

    this.onFirstNameChange = this.onFirstNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this)
    this.onDisplayNameChange = this.onDisplayNameChange.bind(this)
    this.onAOIChange = this.onAOIChange.bind(this)
    this.onDepartmentChange = this.onDepartmentChange.bind(this)
    this.onTeamChange = this.onTeamChange.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onSkillChange = this.onSkillChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(){}

  componentDidUpdate(prevProps) {
    if (prevProps.idToken !== this.props.idToken) {
      this.setState({
        idToken: this.props.idToken,
        email: this.props.email,
        accessToken: this.props.accessToken,
        username: this.props.username
      })
    }
  }

  onFirstNameChange(event) {
    this.setState({firstName: event.target.value})
  }

  onLastNameChange(event){
    this.setState({lastName: event.target.value})
  }

  onDisplayNameChange(event){
    this.setState({displayName: event.target.value})
  }

  onAOIChange(event){
    this.setState({areaOfInterest: event.target.value})
  }

  onDepartmentChange(selected){
    this.setState({department: selected.value})
  }

  onTeamChange(selected){
    var teams = selected.map(item => {return item.value})
    this.setState({teams: teams})
  }

  onTitleChange(selected){
    this.setState({title: selected.value})
  }

  onSkillChange(selected){
    var skills = selected.map(item => {return item.value})
    this.setState({skills: skills})
  }

  handleClick() {
    var body =  {
      "userInfo": {
        "email": this.state.email,
        "username": this.state.username,
        "firstName": this.state.firstName,
        "lastName": this.state.lastName,
        "displayName": this.state.displayName,
        "jobTitle": this.state.title,
        "department": this.state.department,
        "teams": this.state.teams,
        "skills": this.state.skills,
        "areaOfInterest": this.state.areaOfInterest
      }
    }

    var url = process.env.REACT_APP_HOST + "/user-info"

    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.state.idToken,
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(results => {
      this.state.handleProfileCreated()
    })
    .catch(err => console.log(err))
  }



  render() {
  	return (
        <div className="container text-center">
          <div className="row">
            <div className="col-md-2">
            </div>
            <div className="col-md-8">
              <form>
                <h1>Customize your profile</h1>

                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input type="text" id="firstName" className="form-control" placeholder="First Name" onChange={this.onFirstNameChange}/>

                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input type="text" id="lastName" className="form-control" placeholder="Last Name" onChange={this.onLastNameChange}/>


                <label htmlFor="displayName" className="sr-only">Display Name</label>
                <input type="text" id="displayName" className="form-control" placeholder="Display Name" onChange={this.onDisplayNameChange}/>

                <label htmlFor="areaOfInterest" className="sr-only">Area of interest</label>
                <textarea type="textarea" id="areaOfInterest" className="form-control" placeholder="Area of Interest" onChange={this.onAOIChange}/>
                <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleClick}>Create Profile</button>
              </form>
            </div>
            <div className="col-md-2">
            </div>
          </div>
        </div>
      )   
    }
}

export default ProfileRegistration