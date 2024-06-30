<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventarliste</title>
    <link rel="icon" type="image/x-icon" href="assets/img/inventar.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" type="text/css" href="https://npmcdn.com/flatpickr/dist/themes/dark.css">
    <link rel="stylesheet" href="cookiebanner/cookiebanner.style.css">
    <script language="javascript" type="text/javascript" src="js/login.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="cookiebanner/cookiebanner.script.js"></script>
    <style>*{margin:0;padding:0;text-decoration:none;list-style:none;box-sizing:border-box;}</style>
    <script>$(document).ready(function() {cookieBanner.init();});
</script>
    <?php 
    include 'authentification/check_login.php'; 
    if (isset($_SESSION['user_id'])) : 
    ?>
        <script src="js/script.js"></script>
        <script src="js/database.js"></script>
        <script src="js/generateHTML.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <?php endif; ?>
</head>

<body>
    <header>
        <div class="header-left">
            <img class="logo-icon" src="./assets/img/inventar.png">
            <div class="greeting-text"><?php echo "Hallo " . ($_SESSION['username'] ?? '') . "!"; ?></div>
        </div>
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
                    <div onclick="goBackToMain(this)" class="gallery-button">Zurück</div>
                    <div onclick="toggleSelect()" class="gallery-button" id="select-btn">Auswählen</div>
                    <img onclick="deleteImageConfirmation()" class="delete-icon-images" id="deleteImage" src="./assets/img/delete.png" style="display:none;">
                    <img onclick="deleteTagConfirmation()" class="delete-icon-images" id="deleteTag" src="./assets/img/delete.png" style="display:none;">
                </div>
                <div class="gallery" id="gallery"></div>
                <div class="gallery" id="tagsContainer"></div>
            </div>
            <div class="category-item-container"></div>
            <div id="itemContainer" class="itemsContainer"></div>
            <div id="editTableViewContainer" class="editTableView">
                <div onclick="goBackToMain(this)" id="backBtnTableView" class="gallery-button">Zurück</div>
                <div class="editTableColums">
                    <h4>Tabellenspalten bearbeiten</h4>
                    <div class="icon-container-edit-table">
                        <img style="display:none" class="delete-icon" id="deleteColumnIcon" onclick="toggleDeleteColumn(this)" src="./assets/img/delete.png">
                        <img class="add-icon" onclick="togglePopupNewTableColumn()" src="./assets/img/add.png">
                    </div>
                </div>
                <div id="switchContainer" class="switchContainer"></div>
            </div>
            <div id="userAccount" class="user-account">
                <div onclick="goBackToMain(this)" class="gallery-button">Zurück</div>
                <h4>Konto bearbeiten</h4>
                <div id="accountContainer" class="accountContainer"></div>
            </div>
        </div>
    </main>

    <footer>
        <a href="php/logout.php">
            <img src="./assets/img/logout.png">
        </a>
        <div>
            <img class="imprint-icon" onclick="window.location.href = 'imprint/imprint.html';"  src="./assets/img/imprint-icon.png">
            <img onclick="openSettings()" src="./assets/img/setting.png">
        <div>
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
        include 'popups/deleteTag.php';
        include 'popups/deleteUser.php';
        include 'popups/addNewTableColumn.php';
    ?>
       
</body>


</html>