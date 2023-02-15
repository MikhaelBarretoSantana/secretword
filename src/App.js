// CSS
import './App.css';

// React
import { useCallback, useEffect, useState} from "react";

// data
import {wordsList} from "./data/words";

import StartScreen from './Components/StartScreen';
import Game  from './Components/Game';
import GameOver from './Components/GameOver';

const stages  = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, SetPickedWord] = useState("");
  const [pickedCategory, SetPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  console.log(words)

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(category, word);

    return { category, word };
  }, [words]);

  //starts the secret word game
  const startGame = useCallback(() => {
    
    //Clear all letters
    clearLetterStates();

    // pick word and pick category
    const {word, category} = pickWordAndCategory();
    console.log(word,category)

    // create an array of letters 

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(wordLetters)    

  // Fill states
  SetPickedWord(word);
  SetPickedCategory(category);
  setLetters(wordLetters);

  setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    //Check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    // push guessed letter or remove  guess
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter]);
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter]);

      setGuesses((actualGuesses) => actualGuesses - 1 );
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // Check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name)
    }
  }, [guesses])

  // Check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)];

    // Win condition
    if ( guessedLetters.length === uniqueLetters.length) {
      // add Score
      setScore((actualScore) => actualScore += 100);

      //Restar game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame]);

  // restart the game
  const retry = () => {

    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && <Game 
        verifyLetter={verifyLetter} 
        pickedWord={pickedWord}
        pickedCategory={pickedCategory} 
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
        word={words}/>}
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  );
}

export default App;
