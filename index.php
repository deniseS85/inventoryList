<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
    <script language="javascript" type="text/javascript" src="script.js"></script>
</head>
<body>

    <header>
        <img class="logo-icon" src="./assets/img/inventar.png">
        <div class="title">Inventar</div>
        <img onclick="togglePopupNewCategory()" class="add-icon" src="./assets/img/add.png">
    </header>

    <main>
        <div class="sub-content">
            <div class="sub-title">Kategorie Filter</div>
            <div class="search-container">
                <input type="text" placeholder="Suchen" id="categoryFilterInput" oninput="filterCategories()">
                <button class="search-btn">
                    <img class="search-icon" src="./assets/img/search.png">
                </button>    
            </div>    
        </div>

        <div class="main-content">
            <div class="category-item-container"></div>
            <div id="itemContainer" class="itemsContainer"></div>
        </div>
    </main>

    <footer>

    </footer>

    <div id="newCategoryPopup" class="new-category-popup-bg" onclick="togglePopupNewCategory()">
        <div class="new-category-container" onclick="doNotClose(event)">
            <h4 class="popup-title">Neue Kategorie</h4>
            <input id="categoryInput" class="input-new-category" type="text" name="category-name" placeholder="Kategoriename" required oninput="validateInput('addCategoryButton', this)">
            <div class="btn-container">
                <button onclick="togglePopupNewCategory()">Abbrechen</button>
                <button id="addCategoryButton" onclick="addCategoryItem()" disabled>Hinzufügen</button>
            </div>
        </div>
    </div>

    <div id="newItemPopup" class="new-category-popup-bg" onclick="togglePopupNewItem()">
        <div class="new-item-container" onclick="doNotClose(event)">
            <h4 class="popup-title">Neues Produkt</h4>
            <form>
                <div class="form-group">
                    <label for="productName">Produktname:</label>
                    <input id="productName" class="input-new-item" type="text" name="product-name" required oninput="validateInput('addItemButton', this)">
                </div>
                <div class="form-group">
                    <label for="amount">Menge:</label>
                    <input id="productAmount" class="input-new-item" type="text" name="product-amount">
                </div>
                <div class="form-group">
                    <label for="value">Wert:</label>
                    <input id="productValue" class="input-new-item" type="text" name="product-value">
                </div>
                <div class="form-group">
                    <label for="productInfo">Produktinformationen:</label>
                    <input id="productInfo" class="input-new-item" type="text" name="product-info">
                </div>
            </form>
            <div class="btn-container">
                <button onclick="togglePopupNewItem()">Abbrechen</button>
                <button id="addItemButton" onclick="addNewItem()" disabled>Hinzufügen</button>
            </div>
        </div>
    </div>

   

    
</body>


</html>