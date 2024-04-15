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
    <?php include 'db_connection.php'; ?>
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

    <!-- New Category Form -->
    <div id="newCategoryPopup" class="new-category-popup-bg" onclick="togglePopupNewCategory()">
        <div class="new-category-container" onclick="doNotClose(event)">
            <h4 class="popup-title">Neue Kategorie</h4>
            <form id="addCategoryForm" action="addCategory.php" method="post">
                <input id="categoryInput" class="input-new-category" type="text" name="category-name" placeholder="Kategoriename" required oninput="validateInput('addCategoryButton', this)">
                <div class="btn-container">
                    <button type="reset" onclick="togglePopupNewCategory()">Abbrechen</button>
                    <button type="submit" id="addCategoryButton" disabled>Hinzufügen</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Change Category Name -->
    <div id="editCategoryPopup" class="new-category-popup-bg" onclick="togglePopupEditCategory(null)">
        <div class="new-category-container" onclick="doNotClose(event)">
            <h4 class="popup-title">Kategorie ändern</h4>
            <form id="updateCategoryForm" action="updateCategory.php" method="post">
                <input id="categoryCurrentInput" class="input-new-category" type="text" name="newCategoryName" placeholder="Kategoriename">
                <input type="hidden" id="categoryIdInput" name="categoryId" value="">
                <div class="btn-container">
                    <button type="reset" onclick="togglePopupEditCategory(null)">Abbrechen</button>
                    <button type="submit">Speichern</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Category -->
    <div id="deleteCategoryConfirmation" class="new-category-popup-bg" onclick="togglePopupDeleteCategory()">
        <div class="delete-category-container" onclick="doNotClose(event)">
            <h4 class="popup-title">Kategorie löschen</h4>
            <p class="confirmation-message">Bist du sicher, dass du diese Kategorie löschen möchtest?</p>
            <div class="btn-container">
                <button onclick="togglePopupDeleteCategory()">Abbrechen</button>
                <button onclick="deleteCategoryItem()">Löschen</button>
            </div>
        </div>
    </div>

    <!-- New Product Form -->
    <div id="newItemPopup" class="new-category-popup-bg" onclick="togglePopupNewItem()">
        <div class="new-item-container" onclick="doNotClose(event)">
            <h4 class="popup-title">Neues Produkt</h4>
            <form id="addProductForm">
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