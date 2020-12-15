const question = document.getElementById("question")
const choices = Array.from(document.getElementsByClassName("choice-text"))
const progressText = document.getElementById("progressText")
const scoreText = document.getElementById("score")
const progressBarFull = document.getElementById("progressBarFull")
const loader =document.getElementById('loader')
const game = document.getElementById('game')


let currentQuestion = {}
let acceptingAnswer  = false
let score = 0
let questionCounter = 0
let availableQuestions = []

let questions =[]

fetch("question.json")
.then( res =>{
    return res.json()
})
.then (loadedQuestion =>{
    console.log(loadedQuestion)
    questions =loadedQuestion

    
    startGame();
})
.catch(err=>{
    console.error(err);
})

const CORRECT_BONUS = 10
const MAX_QUESTION = 5

startGame = ()=>{
    questionCounter=0
    score = 0
    availableQuestions = [...questions]
    
    getNewQuestion()
    
    game.classList.remove('hidden')
    loader.classList.add('hidden')
}
getNewQuestion=()=>{
    if(availableQuestions.length === 0|| questionCounter> MAX_QUESTION){
        localStorage.setItem("mostRecentScore",score)
        //ENDPAGE
        return window.location.assign('end.html')
    }

    questionCounter++

    //update progress bar
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTION}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTION)*100}%`

    //random question
    const questionIndex = Math.floor(Math.random()*availableQuestions.length)
    currentQuestion=availableQuestions[questionIndex]
    question.innerText=currentQuestion.question

    choices.forEach(choice=>{
        const number = choice.dataset["number"]
        choice.innerText = currentQuestion["choice"+number]
    })
    availableQuestions.splice(questionIndex, 1)
    acceptingAnswer = true
}

choices.forEach(choice=>{
            choice.addEventListener('click',e =>{
            if(!acceptingAnswer) return
            acceptingAnswer=false
            const selectedChoice = e.target
            const selectedAnswer = selectedChoice.dataset['number']

           
            const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

            if(classToApply=='correct'){
                incrementScore(CORRECT_BONUS)
            }
            
            selectedChoice.parentElement.classList.add(classToApply)
            setTimeout(() =>{
                selectedChoice.parentElement.classList.remove(classToApply)
                getNewQuestion()

            },1000
            )
        });
    });
    incrementScore=num=>{
        score +=num
        scoreText.innerText =score
    }

   
