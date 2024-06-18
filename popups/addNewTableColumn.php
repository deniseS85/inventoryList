<div id="newTableColumnPopup" class="new-category-popup-bg" onclick="togglePopupNewTableColumn()">
    <div class="new-item-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Neue Tabellenspalte</h4>
        <form id="addTableColumnForm" action="php/addTableColumn.php" method="post" autocomplete="off" onsubmit="return validateAddColumnForm(event)">
            <div class="form-group">
                <label for="columnName">Name:</label>
                <input id="columnName" class="input-new-item" type="text" name="column-name" required onkeydown="return /[a-zA-Z0-9\säöüß.,]/.test(event.key)" oninput="validateInput('addTableColumnButton', this)" maxlength="20">
            </div>

            <label>Datentyp:</label>
            <div class="columntype-container">
                <div class="option">
                    <input type="radio" id="varchar" name="column_type" value="VARCHAR" class="type-radio">
                    <label for="varchar" class="column-type">Text</label>
                </div>
                <div class="option">
                    <input type="radio" id="int" name="column_type" value="INT" class="type-radio">
                    <label for="int" class="column-type">Zahl</label>
                </div>
                <div class="option">
                    <input type="radio" id="date" name="column_type" value="DATE" class="type-radio">
                    <label for="date" class="column-type">Datum</label>
                </div>
            </div>
            <div class="error" id="typeError"></div>
                
            <div class="btn-container">
                <button type="reset" onclick="togglePopupNewTableColumn()">Abbrechen</button>
                <button type="submit" id="addTableColumnButton" disabled>Hinzufügen</button>
            </div>
        </form>
    </div>
</div>

<div id="infoAddNewColumn" class="new-category-popup-bg" onclick="togglePopup('infoAddNewColumn')">
    <span class="new-item-container" onclick="doNotClose(event)">    
        <div class="info-header-add-colum">Tabellenspalte erfolgreich hinzugefügt!</div>
        <div class="info-add-colum">Du kannst jetzt deine Tabelle anpassen.</div>
        <div class="btn-container">
            <button style="padding:5px 30px;border-radius:10px;" onclick="togglePopup('infoAddNewColumn')">Okay</button>
        </div>
    </span>
</div>

