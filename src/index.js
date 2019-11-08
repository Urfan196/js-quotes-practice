const ulTag = document.querySelector('#quote-list')

// FETCH ALL QUOTES
fetch('http://localhost:3000/quotes?_embed=likes')
.then(resp => resp.json())
.then(quotes => {
    quotes.map(quote => {
        ulTag.innerHTML += renderSingleQuotes(quote)
    })
})

function renderSingleQuotes(quote){
    return `
    <li class='quote-card' data-id="${quote.id}">
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
    </blockquote>
    </li> `
}

// SUBMIT FORM - CREATE A NEW QUOTE
const formElement = document.querySelector('#new-quote-form')

formElement.addEventListener('submit', e => {
    e.preventDefault()
   const newQuote = e.target.querySelector('#new-quote').value
   const newAuthor = e.target.querySelector('#author').value

    fetch('http://localhost:3000/quotes?_embed=likes', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                quote: newQuote,
                author: newAuthor,
                likes: []
        })
    })
    .then(resp => resp.json())
    .then(data => {
        ulTag.innerHTML += renderSingleQuotes(data)
    })
})

//DELETE A QUOTE
ulTag.addEventListener('click', e => {
    if(event.target.textContent === 'Delete'){

    const quoteElement = event.target.parentElement.parentElement
    const quoteElementId = quoteElement.dataset.id

    fetch(`http://localhost:3000/quotes/${quoteElementId}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
    .then(data => {
        quoteElement.remove()
    })
    }
})

//CREATE LIKE BUTTON
ulTag.addEventListener('click', e => {
    if (event.target.className === "btn-success" ){
        e.preventDefault()

        const quoteElement = event.target.parentElement.parentElement
        const quoteElementId = parseInt(quoteElement.dataset.id)

        const likeSpan = quoteElement.querySelector('span')
        fetch('http://localhost:3000/likes', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quoteId: quoteElementId
            })
        })
        .then(resp => resp.json())
        .then(data => {
            likeSpan.textContent = parseInt(likeSpan.textContent) + 1
        })
        
    }
})
