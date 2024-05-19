<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
    <script language="javascript" type="text/javascript" src="js/script.js"></script>
    <script language="javascript" type="text/javascript" src="js/database.js"></script>
    <script language="javascript" type="text/javascript" src="js/generateHTML.js"></script>
</head>
<body>
    <?php include 'php/db_connection.php'; ?>
    
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
            <div class="gallery-container" id="galleryContainer">
                <div class="gallery-header">
                    <div onclick="goBackToMain()" class="gallery-button">Zurück</div>
                    <div onclick="toggleSelect()" class="gallery-button" id="select-btn">Auswählen</div>
                    <img onclick="deleteImageConfirmation()" class="delete-icon-images" id="deleteImage" src="./assets/img/delete.png" style="display:none;">
                </div>
                <div class="gallery" id="gallery"></div>
            </div>
            <div class="category-item-container"></div>
            <div id="itemContainer" class="itemsContainer"></div>
        </div>
    </main>

    <footer>
        <div></div>
        <img onclick="openSettings()" src="./assets/img/setting.png">
    </footer>
    
    <?php 
        include 'popups/newCategory.php'; 
        include 'popups/editCategory.php'; 
        include 'popups/deleteCategory.php';
        include 'popups/productDetail.php'; 
        include 'popups/deleteProduct.php';
        include 'popups/newProduct.php'; 
        include 'popups/editProduct.php'; 
        include 'popups/newTag.php';
        include 'popups/settings.php';
        include 'popups/deleteImage.php';
    ?>
       
</body>


</html>