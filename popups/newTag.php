<div id="newTagPopup" class="new-category-popup-bg" onclick="togglePopupNewTag()">
    <div class="new-tag-container" onclick="doNotClose(event)">
        <h4 class="popup-title-new-tag">Neuer Tag</h4>
        <form id="addTagForm" action="php/addTag.php" method="post" autocomplete="off">
            <input id="tagInput" class="input-new-tag" type="text" name="tag-name" placeholder="Tagname" required oninput="validateInput('addTagButton', this)">
            <input type="hidden" id="tagColorInput" name="tag-color">
            <div class="select-colors"></div>
            <div class="btn-container-new-tag">
                <button type="reset" onclick="togglePopupNewTag()">Abbrechen</button>
                <button type="submit" id="addTagButton" disabled>Hinzufügen</button>
            </div>
        </form>
    </div>
</div>