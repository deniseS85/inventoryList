<div id="newTagPopup" class="new-category-popup-bg" onclick="togglePopupNewTag()">
    <div class="new-tag-container" onclick="doNotClose(event)">
        <h4 class="popup-title-new-tag">Neuer Tag</h4>
        <input onkeydown="return /[a-z]/i.test(event.key)" id="tagInput" class="input-new-tag" type="text" placeholder="Tagname" required oninput="validateInput('addTagButton', this)">
        <input type="hidden" id="tagColorInput" name="tag-color">
        <div class="select-colors"></div>
        <div class="btn-container-new-tag">
            <button onclick="togglePopupNewTag()">Abbrechen</button>
            <button id="addTagButton" onclick="addNewTag()">Hinzufügen</button>
        </div>
    </div>
</div>