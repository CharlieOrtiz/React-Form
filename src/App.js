import React from 'react';
import isEmail from 'validator/lib/isEmail';

class Form extends React.Component {
    state = {
        fields: {
          name: '',
          email: ''
        },
        fieldErrors: {},
        people: []
      };
    
      onFormSubmit = evt => {
        const people = [...this.state.people];
        const person = this.state.fields;
        //Execute the validate form function to see if there's errors in the inputs
        const fieldErrors = this.validate(person);
        this.setState({fieldErrors});
        evt.preventDefault();
    
        if (Object.keys(fieldErrors).length) return;
    
        this.setState({
          people: people.concat(person),
          fields: {
            name: '',
            email: ''
          }
        });
      };
    
      onInputChange = input => {
        //Change the fields property in state to update the input value in the UI
        const fields = Object.assign({}, this.state.fields);
        fields[input.name] = input.value;
        this.setState({fields});
        //1.Object variable, in charge of add a property value for a specific error input
        let fieldErrors = Object.assign({}, this.state.fieldErrors);
        //2. Change the properties of that variable into array
        const arrayErrors = Object.keys(fieldErrors);
        //3. If there's a property error different from the input where our user is typing, then add the property to otherErrors variable
        const OtherErrors = arrayErrors.filter((err) => (err !== input.name));
    
        //If there's a typing error in our input, add it to the corresponding fieldErrors' property
        if(input.errors) {
          fieldErrors[input.name] = input.errors;
          //If there's another error outside our input:
        } else if(OtherErrors.length) {
          //1. Save that error in a variable
          const restInputErrors = fieldErrors[OtherErrors]
          //2. Clear fieldErrors property in order to remove the error typing of the actual input
          fieldErrors = {};
          //3. Add the error, saved in step 1, to fieldErrors variable
          fieldErrors[OtherErrors] = restInputErrors;
          //If there's not any error at all
        } else {
          fieldErrors = {};
        }
        this.setState({fieldErrors});
      };
    
      //Validate Form function
      validate = person => {
        const errors = Object.assign({}, this.state.fieldErrors);
        if (!person.name) errors.name = 'Name Required';
        if (!person.email) errors.email = 'Email Required';
        return errors;
      };
    
      render() {
        return (
          <div>
            <h1>Sign Up Sheet</h1>
    
            <form onSubmit={this.onFormSubmit}>
              {/*Field component represents a input element*/}
              <Field
                placeholder='Name'
                name='name'
                value={this.state.fields.name}
                onChange={this.onInputChange}
                validate={(name) => (!name.match(/^[A-Za-z]+$/)) ? 'Invalid Name' : ''} /* validate prop is a function to validate the input itself while this one is on change */
              />
              <span style={{color: 'red'}}>{this.state.fieldErrors.name}</span>
              <br />
    
              <Field
                placeholder='Email'
                name='email'
                value={this.state.fields.email}
                onChange={this.onInputChange}
                validate={(email) => (email && !isEmail(email) ? 'Invalid Email' : '')}
              />
              <span style={{color: 'red'}}>{this.state.fieldErrors.email}</span>
              <br />
    
              <input type="submit" />
            </form>
    
            <div>
              <h3>People</h3>
              <ul>
                {this.state.people.map(({name, email}, i) => (
                  <li key={i}>
                    {name} ({email})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }
}

class Field extends React.Component {

    onInputChange = (e) => {
      const input = {}
      //If our input has a validate property or in other words if it's going to validate at the typing time then:
      if(this.props.validate) input.errors = this.props.validate(e.target.value); //1. Execute the validate prop a save the return value inside input.errors
      input.name = e.target.name;
      input.value = e.target.value;
      //Execute the onChange prop passing the input object with the properties that were assigned above
      this.props.onChange(input);
    }
  
    render () {
      return (
          <input
            placeholder={this.props.placeholder}
            name={this.props.name}
            value={this.props.value}
            onChange={this.onInputChange}
          />
      )
    }
}

export default Form;