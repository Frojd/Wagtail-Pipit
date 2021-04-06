# Handling CSRF Tokens in Pipit

There are several ways of working with CSRF tokens, you can either:
- Set a cookie containing the CSRF on your backend and then pick it up on the clientside using js
- Pass the csrf token to your frontend using a API (this guide will cover this)

## Requirements

- An understanding of [CSRF (Cross-Site Request Forgery)](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

## Guide

In this guide we will generate a CSRF token in a page serializer and pass that along to a React container component, that will pass it to a form component, that will use to to send data to a fictional api.

- First start with returning a CSRF token from a page serializer

```python
# src/main/pages/home_serializer.py
from django.middleware import csrf as csrf_middleware

from .base_serializer import BasePageSerializer
from . import HomePage

class HomeSerializer(BasePageSerializer):
    csrf_token = serializers.SerializerMethodField()

    def get_csrf_token(self, _obj):
        request = self.context.get("request")
        return csrf_middleware.get_token(request)

    class Meta:
        model = HomePage
        fields = ['csrf_token'] + BasePageSerializer.Meta.fields
```

- Pick up the CSRF token in your `HomePage` container component and pass it to your `ContactForm` component

```javascript
// containers/HomePage/HomePage.js
import React from 'react';
import PropTypes from 'prop-types';
import { basePageWrap } from '../BasePage';
import Hero from '../../components/Hero';
import ContactForm from '../../components/ContactForm';
import s from './HomePage.module.css';

const HomePage = ({ title, csrfToken }) => {
    return (
        <div className={s.Container}>
            <Hero title={title} />
            <ContactForm csrfToken={csrfToken} />
        </div>
    );
};

HomePage.defaultProps = {
    title: '',
};

HomePage.propTypes = {
    title: PropTypes.string.isRequired,
};

export default basePageWrap(HomePage);
```

- Finally create a `ContactForm` component that will communicate with your API pass the CSRF token in the request header

```javascript
// components/ContactForm/ContactForm.js
import React from 'react';

class ContactForm extends React.Component {
    state = {
        name: '',
    }

    handleChange = (event) => {
        this.setState({value: event.target.value});  
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { csrfToken } = this.props;

        fetch('https://example.test/api/contact', {
            body: JSON.stringify({ name: this.state.name }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        }).then(resp => console.log(resp));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={this.state.name} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default ContactForm;
```
- Done!

TIP: If you want have your CSRF token globally accessible on the frontend, why not use a react context?
