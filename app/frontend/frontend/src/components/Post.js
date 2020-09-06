import React, { Component } from 'react';

export default class Post extends Component {
    render() {
        return (
            <div className="post">

                <img src={this.props.src} alt={this.props.alt}></img>
                <div className="post__name">
                    some account
                </div>
                <div className="post__description">
                    lorem ipsum ist lskjfaklja;flakj;lf ka;jdl kja;l fja lkad 
                     ad;flakjf;aldkfja ;dkfja; lsd kjdaskjf 
                    a;sldkfjas;ldkfja;skfjsdlkf
                    a;sldfkja;lsdfkjas;ldfkjas;lkfjslakjfs;
                </div>
            </div>
        );
    }
}