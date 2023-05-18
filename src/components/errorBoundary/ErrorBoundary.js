import { Component } from "react";

class ErrorBoundary extends Component
{
    state = {
        error: false
    }

    componentDidCatch(error, errorinfo)
    {
        console.log(error, errorinfo);
        this.setState({
            error: true
        })
    }

    render() {

        if (this.state.error) 
        {
            return <h2>Somethins went wrong</h2>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;