import React,{ Component } from 'react';

import PropTypes from 'prop-types';
import Spinner from '../spinner/spinner';
import ErrorMesage from '../errormesage/ErrorMesage'
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component 
{
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1544,
        charEnded: false
    }

    


    marvelService = new MarvelService();

    itemRefs = [];

    setRef = (ref) =>
    {
        this.itemRefs.push(ref)
    }
    // changecolor = () =>
    // {
         
    // }
    focusFirst = (id) =>
    {
    //    document.querySelector('.char__item').focus()
    //     // this.myRef.focus()
    //     console.log('work')
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    componentDidMount() 
    {
        this.onRequest();
        //this.myRef.current.focus();
    }

    onRequest = (offset) =>
    {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () =>
    {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9)
        {
            ended = true;    
        }

        this.setState(({offset, charList}) => ({
                charList: [...charList, ...newCharList],
                loading: false,
                newItemLoading: false,
                offset: offset + 9,
                charEnded: ended
        }))
    }

    onError = () => 
    {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems(arr) {
        const items = arr.map((item, i) => {
            let imgstyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgstyle = { 'objectFit': 'unset' };
            }
            return (
                <li
                    ref={this.setRef}
                    tabIndex={0}
                    className='char__item'
                    key={item.id}
                    onClick={() => {this.props.onCharSelected(item.id); 
                                    this.focusFirst(i)}}
                    onKeyPress={(e) => {
                        if(e.key === '' || e.key === 'Enter')
                        {
                            this.props.onCharSelected(item.id);
                            this.focusFirst(i);
                        }
                    }}>
                        
                    <img src={item.thumbnail} alt={item.name} style={imgstyle} />
                    <div className="char__name">{item.name}</div>
                </li>
                
            )
        });
        return (
            <ul className='char__grid'>
                {items}
            </ul>
        )
    }

    render()
    {
        const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMesage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none':'block'}}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
 }

CharList.propTypes = {
    onCharSelected:PropTypes.func
}

export default CharList;