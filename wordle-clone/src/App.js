import logo from "./logo.svg";
import { useEffect } from "react";
import React from "react";
import "./App.css";

export class Words extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ["", "", "", "", "", ""],
      numWords: 0,
    };
  }
  // useEffect(() => {
  //   document.addEventListener("keydown", detectKeyDown, true);
  // }, []);

  detectKeyDown = (e) => {
    var key = e.key.toLowerCase();
    if (key.length === 1 && (key >= "a" || key <= "z")) {
      if (this.state.words[this.state.numWords].length < 6) {
        this.state.words[this.state.numWords] += key;
      }
      console.log(e.key);
    }
    if (e.key === "\n") {
      // if (e.key === "\n" && this.state.words[this.state.numWords].length === 6) {
      // finishWord();
      var newLen = this.state.numWords + 1;
      this.setState({ numWords: newLen });
    }
    if (e.key === "Backspace") {
      this.state.words[this.state.numWords] = this.state.words[
        this.state.numWords
      ].substring(0, this.state.words[this.state.numWords].length - 1);
    }
    console.log(this.state.words);
  };

  // finishWord = () => {};

  renderWord(i) {
    return <h1>{this.state.words[i]}</h1>;
  }

  render() {
    return (
      <div className="wordHolder">
        {this.state.words.map((txt) => (
          <p>{txt}</p>
        ))}
      </div>
    );
  }
}


function App() {
  useEffect(() => {
    document.addEventListener("keydown", detectKeyDown, true);
  }, []);

  const detectKeyDown = (e) => {
    Words.functions.detectKeyDown(e);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Words />
      </header>
    </div>
  );
}

export default App;
