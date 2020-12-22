let fs = require('fs');
const { performance } = require('perf_hooks');

try {
    const inputData = fs.readFileSync('./input.txt', 'utf8');
    
    const t0 = performance.now();

    const foodsRaw = inputData.split('\r\n');

    // Build a data structure like this:
    /*
    [
        { ingredients: [...], allergens: [...] },
        { ingredients: [...], allergens: [...] },
        { ingredients: [...], allergens: [...] },
        .
        .
        .
    ]
    */

    let foods = [];
    let allAllergens = [];
    let allIngredients = [];

    for (let line of foodsRaw) {
        let food = {};

        const parts = line.split(' (contains ');
        const ingredients = parts[0].split(' ');
        food.ingredients = ingredients;

        let allergens = parts[1].split(', ');
        const lastAllergen = allergens[allergens.length - 1];
        if (lastAllergen[lastAllergen.length - 1] === ')') {
            allergens[allergens.length - 1] = lastAllergen.substring(0, lastAllergen.length - 1);
        }

        food.allergens = allergens;

        // build a list of all ingredients:
        // allIngredients = [...]
        for (let ingredient of ingredients) {
            if (allIngredients.indexOf(ingredient) === -1) allIngredients.push(ingredient);
        }

        // build a list of all allergens:
        // allAllergens = [...]
        for (let allergen of allergens) {
            if (allAllergens.indexOf(allergen) === -1) allAllergens.push(allergen);
        }

        foods.push(food);
    }

    // console.log(foods);
    // console.log(allAllergens);
    
    // maintain a list of the ingredient - allergen pairs:
    /*
    allergenTable = {
        ingredient1: allergen1,
        ingredient2: allergen2,
        ingredient3: allergen3
        .
        .
        .
    }
    */

    let allergenTable = {};
    let allergensFound = 0;

    for (let ingredient of allIngredients) {
        allergenTable[ingredient] = false;
    }

    // the allergenTable starts empty
    // to build the allergenTable, loop through allAllergens and grab the rows that contain the allergen
    //   then check if there is an ingredient present in all of these rows
    //   if there's only 1, add it to the allergenTable (if not already there)
    //   if there's more than one, check if some of them are already in the allergenTable - if only 1 is missing, add that
    // continue going throught the allergens, grabbing all the rows that contain it etc.
    // stop if the keys in the allergenTable equals the number of elements in allAllergens
    // start the loop again if it didn't stop and went through all the allergens in allAllergens (the situation in the previous line didn't occur)
    
    const getFoodsForAllergen = allergen => {
        let foodList = [];
        
        for (let food of foods) {
            if (food.allergens.indexOf(allergen) > -1) foodList.push(food);
        }

        return foodList;
    }

    const getCommonIngredients = foodList => {
        if (foodList.length === 0) return [];
        if (foodList.length === 1) return foodList[0].ingredients;
        
        let first = foodList[0].ingredients;
        let second = foodList[1].ingredients;

        for (let i = 0; i < foodList.length; i++) {
            const common = first.filter(ingredient => second.indexOf(ingredient) > -1);
            first = common;
            second = foodList[i].ingredients;
        }

        return first.filter(ingr => second.indexOf(ingr) > -1);
    }

    let done = false;

    while (!done) {
        for (let allergen of allAllergens) {
            const foodList = getFoodsForAllergen(allergen);
            const commonIngredients = getCommonIngredients(foodList);
            const filteredCommonIngredients = commonIngredients.filter(ingredient => {
                return allergenTable[ingredient] === false;
            })

            if (filteredCommonIngredients.length === 1) {
                allergenTable[filteredCommonIngredients[0]] = allergen;
                allergensFound++;
            }

            if (allergensFound === allAllergens.length) {
                done = true;
                break;
            }
        }
    }

    // console.log(allergenTable);

    let allergenIngredients = [];
    for (let ingredient in allergenTable) {
        if (allergenTable[ingredient] !== false){
            let newEntry = {};
            newEntry[ingredient] = allergenTable[ingredient];
            allergenIngredients.push(newEntry);
        }
    }

    // console.log(allergenIngredients);

    allergenIngredients.sort((a, b) => {
        let a_prop = Object.keys(a)[0];
        let b_prop = Object.keys(b)[0];

        if ( a[a_prop] < b[b_prop] ) return -1;
        if (a[a_prop] > b[b_prop]) return 1;
        return 0;
    });

    // console.log(allergenIngredients);

    let canonicalDangerousIngredientList = '';

    for (let i = 0; i < allergenIngredients.length; i++) {
        const allergenIngredient = allergenIngredients[i];
        const ingredient = Object.keys(allergenIngredient)[0];
        canonicalDangerousIngredientList += ingredient;
        if (i !== allergenIngredients.length - 1) {
            canonicalDangerousIngredientList += ',';
        }
    }

    console.log(`My canonical dangerous ingredient list: ${canonicalDangerousIngredientList}`);
    
    const t1 = performance.now();
    console.log(`Performance: ${t1 - t0} ms.`);

} catch (e) {
    console.log('Error:', e.stack);
}