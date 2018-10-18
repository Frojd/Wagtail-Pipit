{% raw -%}
import React from 'react';
import './Wysiwyg.css';

const Wysiwyg = ({wysiwyg}) => (
    <div className="Wysiwyg" dangerouslySetInnerHTML={{__html: wysiwyg}} />
);

export default Wysiwyg;
{%- endraw %}
