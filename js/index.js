let pokemons;
let IdOfCurrentPokemon = 0;
(async function() {
    let response = await fetch("http://localhost:3000");

    if (response.ok) {
        pokemons = await response.json();
        console.log(pokemons);
        showPokemon(0);
    } else {
        alert("Error: " + response.status);
    }
})();

document.querySelector(".title-arrow-forward").addEventListener("click", changePokemon);
document.querySelector(".title-arrow-backward").addEventListener("click", () => changePokemon(false));

function changePokemon(moveForward = true){
    if (moveForward){
        if (IdOfCurrentPokemon == pokemons.length - 1){
            IdOfCurrentPokemon = -1;
        }
        showPokemon(IdOfCurrentPokemon + 1);
        IdOfCurrentPokemon++;
    } else {
        if (IdOfCurrentPokemon == 0){
            IdOfCurrentPokemon = pokemons.length;
        }
        showPokemon(IdOfCurrentPokemon - 1);
        IdOfCurrentPokemon--;
    }
}


function addTitleAndId(number){
    document.querySelector(".name").innerHTML = `${pokemons[number].Title}`;
    document.querySelector(".number").innerHTML = `00${pokemons[number].Id}`;
}

function addMainImage(number){
    document.querySelector(".main-image").innerHTML = `<img src="data:image/png;base64, ${pokemons[number].Image}" width="100%" height="100%">`;
}

function addDescription(number){
    document.querySelector(".description").innerHTML = `${pokemons[number].Description}`;
}

function addWeaknesses(number){
    document.querySelector(".weakness-column").innerHTML = "";
    pokemons[number].Weaknesses.split(" ").forEach(e => {
        if (e != 0){
            let newDiv = document.createElement("div");
            newDiv.innerHTML = e.at(0).toUpperCase() + e.slice(1);
            document.querySelector(".weakness-column").appendChild(newDiv);
        }
    })
}

function addTypes(number){
    document.querySelector(".type-column").innerHTML = "";
    pokemons[number].Types.split(" ").forEach(e => {
        if (e != 0){
            let newDiv = document.createElement("div");
            newDiv.innerHTML = e.at(0).toUpperCase() + e.slice(1);
            document.querySelector(".type-column").appendChild(newDiv);
        }
    })
}

function addSkills(number){

    document.querySelectorAll(".attribute-level").forEach((elem) => {
        elem.style.background = '#D9D9D9';
    })

    addSkill("hp", pokemons[number].Hp);
    addSkill("attack", pokemons[number].Attack);
    addSkill("defense", pokemons[number].Defense);
    addSkill("specialAttack", pokemons[number].SpecialAttack);
    addSkill("specialDefense", pokemons[number].SpecialDefense);
    addSkill("speed", pokemons[number].Speed);

    function addSkill(skill, value){
        for (let i = 1; i <= value; i++){
            document.querySelector(`.${skill}-${i}`).style.background = "rgba(51, 0, 255, 0.47)";
        }
    }
}

function add_Gender_Category_Abilities_Height_Weight(number){
    document.querySelector(".height").innerHTML = `<b>Height:</b> <br> ${pokemons[number].Height} m`;
    document.querySelector(".weight").innerHTML = `<b>Weight:</b> <br> ${pokemons[number].Weight} kg`;
    document.querySelector(".gender").innerHTML = `<b>Gender:</b> <br> ${pokemons[number].Gender}`;
    document.querySelector(".category").innerHTML = `<b>Category:</b> <br> ${pokemons[number].Category.at(0.).toUpperCase()}${pokemons[number].Category.slice(1)}`;

    let abilities = pokemons[number].Abilities.split(" ");
    document.querySelector(".abilities").innerHTML = `<b>Abilities:</b> <br>`;
    abilities.forEach(e => {
        if (e != ""){
            let result = e.at(0).toUpperCase() + e.slice(1);
            document.querySelector(".abilities").append(result);
            document.querySelector(".abilities").appendChild(document.createElement(`br`));
        }
    });

}

// Evolution section

let counterOfForms;

document.querySelector(".evolution-arrow-forward").addEventListener("click", changeEvolutionForm);
document.querySelector(".evolution-arrow-backward").addEventListener("click", changeEvolutionForm);

function changeEvolutionForm(){
    if (counterOfForms == 1){
        document.querySelector(".evolution-picture").innerHTML = `<img src="data:image/png;base64, ${pokemons[IdOfCurrentPokemon].SecondEvolutionImage}" width="100%" height="100%">`;
        document.querySelector(".evolution-form-title").innerHTML = `${pokemons[IdOfCurrentPokemon].SecondEvolutionName}`;
        counterOfForms++;
    } else {
        document.querySelector(".evolution-picture").innerHTML = `<img src="data:image/png;base64, ${pokemons[IdOfCurrentPokemon].EvolutionImage}" width="100%" height="100%">`;
        document.querySelector(".evolution-form-title").innerHTML = `${pokemons[IdOfCurrentPokemon].EvolutionName}`;
        counterOfForms--;
    }
}

function addEvolutionImage(number){
    document.querySelector(".evolution-picture").innerHTML = `<img src="data:image/png;base64, ${pokemons[number].EvolutionImage}" width="100%" height="100%">`;
    document.querySelector(".evolution-form-title").innerHTML = `${pokemons[number].EvolutionName}`;
    counterOfForms = 1;
}

function isSecondEvolutionFormExist(number){
    if (pokemons[number].SecondEvolutionName == null){
        document.querySelector(".evolution-arrow-forward").style.display = "none";
        document.querySelector(".evolution-arrow-backward").style.display = "none";
    } else {
        document.querySelector(".evolution-arrow-forward").style.display = "block";
        document.querySelector(".evolution-arrow-backward").style.display = "block";
    }
}

function showPokemon(number){
    addTitleAndId(number);
    addMainImage(number);
    addDescription(number);
    addWeaknesses(number);
    addTypes(number);
    addSkills(number);
    add_Gender_Category_Abilities_Height_Weight(number);
    isSecondEvolutionFormExist(number);
    addEvolutionImage(number);
}




