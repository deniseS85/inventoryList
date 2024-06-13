<div id="settingsPopup" class="new-category-popup-bg" onclick="openSettings()">
    <div class="setting-container" onclick="doNotClose(event)">
        <h4 class="popup-title">Einstellungen</h4>
        <div class="setting-items">
            <div onclick="getAllImages()">Bilder</div>
            <div onclick="getAllTags()">Tags</div>
            <div onclick="showEditViewTable()">Einstellungen</div>
            <div onclick="exportToExcel()">Liste exportieren</div>
            <div onclick="showAccount()">Konto bearbeiten</div>
        </div>
        <div class="btn-container">
            <button type="button" onclick="openSettings()">Schließen</button>
        </div>
    </div>
</div>