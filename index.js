localStorage.name = "Roma"


// Input files
let pokemonMainImageInput = document.querySelector('#pokemon-main-image-input');
let pokemonMainImageLabel = document.querySelector('#pokemon-main-image-label');

// Uploading images

pokemonMainImageInput.addEventListener("change", () =>{ // Upload the main image
    pokemonMainImageLabel.innerHTML = '<p>File chosen</p>';
    pokemonMainImageLabel.style.background = "black";
    pokemonMainImageLabel.style.color = "white";
});

document.querySelectorAll('.image-input').forEach(e => {
    e.addEventListener("change", uploadImage);
});

function uploadImage(){ // Upload only evolution forms images
    let input = this.classList.item(2).split("-")[0];
    let currentLabel = document.querySelector(`#evolution-form-image-label-${input}`);
    currentLabel.innerHTML = '<p>File chosen</p>';
    currentLabel.style.background = "black";
    currentLabel.style.color = "white";
}

// All dropdowns

document.querySelectorAll(".dropdown-arrow").forEach(e => {
    e.addEventListener("click", e => {
        const clickedButton = e.target.parentElement.classList.item(0).split('-')[0];
        document.querySelectorAll(".dropdown").forEach(e => {
            if (e.classList.contains(clickedButton + "-dropdown")){
                if (e.style.display === 'block'){
                    e.style.display = "none";
                } else{
                    e.style.display = 'block';
                    return
                }
            }
            e.style.display = "none";
        })
        document.querySelectorAll(`.${clickedButton}-drop-el`).forEach(e =>{
            e.addEventListener("click", () => {
                if (e.classList.contains(`${clickedButton}-not-chosen`)){
                    if (isLimitReached(clickedButton)){
                        return
                    }
                    e.classList.add(`${clickedButton}-chosen`);
                    e.classList.remove(`${clickedButton}-not-chosen`);
                } else if (e.classList.contains(`${clickedButton}-chosen`)){
                    e.classList.add(`${clickedButton}-not-chosen`);
                    e.classList.remove(`${clickedButton}-chosen`);
                }
            })
        });
    })
});

function isLimitReached (inputElement){
    let limit = 0;
    switch (inputElement){
        case "weakness":
            limit = 4;
            break
        case "type":
            limit = 2;
            break
        case "gender":
            limit = 1;
            break
        case "category":
            limit = 1;
            break
        case "abilities":
            limit = 2;
            break
    }

    if (document.querySelectorAll(`.${inputElement}-chosen`).length >= limit){
        alert("Too much");
        return true
    } else {
        return false
    }
}

// Parameters

let listOfChosenAttribute = [];

// The list should have a key-value structure
let listOfAttributeValues = [];

document.querySelectorAll(".attribute-level").forEach(e => {
    e.addEventListener("mouseover", showAttributeLevel);
    e.addEventListener("mouseout", removeAttributeLevel);
});


function showAttributeLevel(){
    let currentAttribute = this.classList.item(0);
    let currentLevel = this.classList.item(2).split("-")[1];

    listOfChosenAttribute = document.querySelectorAll(`.${currentAttribute}`);
    listOfChosenAttribute.forEach(e =>{
        e.addEventListener("click", setAttribute);
    })

    for (let i = 1; i <= +currentLevel; i++){
        document.querySelector(`.${currentAttribute}-${i}`).style.background = "rgba(51, 0, 255, 0.47)";
    }
    function setAttribute(){
        // removeAttributeLevel();

        for (let i = 1; i <= +currentLevel; i++){
            document.querySelector(`.${currentAttribute}-${i}`).style.background = "rgba(51, 0, 255, 0.47)";
        }

        for (let i = 0; i < listOfChosenAttribute.length; i++){
            listOfChosenAttribute[i].removeEventListener("mouseout", removeAttributeLevel);
            listOfChosenAttribute[i].removeEventListener("mouseover", showAttributeLevel);
        }
    }
}

function removeAttributeLevel(){
    for (let i = 0; i < listOfChosenAttribute.length; i++){
        listOfChosenAttribute[i].style.background = "#D9D9D9";
        listOfChosenAttribute[i].style.boxShadow = "inset 0px 4px 4px rgba(0, 0, 0, 0.25)";
    }
}

// Add one more evolution form

const originEvolutionForm = document.querySelector(".evolution-form");

document.querySelector(".add-one-more-form-button").addEventListener("click", () => {

    let newEvolutionBlock = document.createElement("div");
    let parentFormBlock = document.createElement("div");
    parentFormBlock.classList.add("evolution-form-wrapper");

    newEvolutionBlock.classList.add("double-evolution-form");
    newEvolutionBlock.appendChild(createForm("first"));
    newEvolutionBlock.appendChild(createForm("second"));

    parentFormBlock.appendChild(newEvolutionBlock);
    parentFormBlock.appendChild(createRemoveFormButton());

    document.querySelector(".evolution-form-inner-wrapper").replaceChild(parentFormBlock, originEvolutionForm);

    document.querySelector(".remove-evolution-form").addEventListener("click", () => {
        document.querySelector(".evolution-form-inner-wrapper").replaceChild(originEvolutionForm, parentFormBlock);
    })

    document.querySelectorAll('.image-input').forEach(e => { // Need to collect again since the form was changed
        e.addEventListener("change", uploadImage);
    });

    function createForm(formNumber){
        let form = document.createElement("div");
        form.classList.add(`${formNumber}-evolution-form`);
        form.appendChild(createTitle());
        form.appendChild(createPicture());
        function createTitle(){
            let formTitle = document.createElement("div");
            formTitle.classList.add("evolution-form-title");
            formTitle.classList.add(`${formNumber}-evolution-title`);
            formTitle.style.height = "40%";

            let titleInput = document.createElement("input");
            titleInput.type = "text";
            titleInput.placeholder = "Evolution form name";
            titleInput.classList.add("primary");
            titleInput.id = `${formNumber}-evolution-form-name`;

            formTitle.appendChild(titleInput);
            return formTitle;
        }

        function createPicture(){
            let formPicture = document.createElement("div");
            formPicture.classList.add("evolution-form-picture");
            formPicture.classList.add(`${formNumber}-evolution-picture`);
            formPicture.style.height = "40%";

            let pictureInput = document.createElement("input");
            let pictureLabel = document.createElement("label");
            let labelParagraph = document.createElement("p");

            pictureInput.type = "file";
            pictureInput.id = `evolution-form-image-input-${formNumber}`;
            pictureInput.classList.add("primary");
            pictureInput.classList.add("image-input");
            pictureInput.classList.add(`${formNumber}-image-input`);

            pictureLabel.htmlFor = `evolution-form-image-input-${formNumber}`;
            pictureLabel.id = `evolution-form-image-label-${formNumber}`;
            pictureLabel.classList.add("label");
            pictureLabel.classList.add("primary");

            labelParagraph.innerText = "Download image";

            pictureLabel.appendChild(labelParagraph);


            formPicture.appendChild(pictureLabel);
            formPicture.appendChild(pictureInput);

            return formPicture;
        }
        return form;
    }
    function createRemoveFormButton(){
        let removeFormButton = document.createElement("div");
        let removeButtonImg = document.createElement("img");

        removeFormButton.classList.add("remove-evolution-form");
        removeButtonImg.src = "images/minus.png";
        removeButtonImg.style.height = "85%";
        removeButtonImg.style.width = "7%";
        removeFormButton.appendChild(removeButtonImg);

        return removeFormButton
    }
})



