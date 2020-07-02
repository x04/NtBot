import React from 'react';
import Button from "@material-ui/core/Button";

export default class Profiles extends React.Component {
    render() {
        return (
            <div>
                Profiles
                <Button onClick={() => {
                    window.log(window.structTest())
                }}>Item One</Button>
            </div>
        );
    }
}