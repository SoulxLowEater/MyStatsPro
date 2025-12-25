/**
 * @name MyStatsPro
 * @author Miles Aalto
 * @version 1.7.0
 * @description An advanced stats tracker plugin for Discord. {please keep in mind this is not finished and i made it while i was bored--}
 * @source https://github.com/SoulxLowEater/MyStatsPro
 * @website https://github.com/SoulxLowEater/MyStatsPro
 */

module.exports = class MyStatsPro {
    constructor() {
        // Initialize with default values so the UI doesn't break before start()
        this.data = { messages: 0, emojis: {}, lastDate: new Date().toDateString() };
    }

    start() {
        this.loadData();
        
        BdApi.DOM.addStyle("MyStatsStyles", `
            .ms-glass-panel { 
                background: rgba(32, 34, 37, 0.6); 
                backdrop-filter: blur(12px); 
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 16px; padding: 20px; color: #fff;
                font-family: "gg sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
            }
            .ms-stat-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 15px; }
            .ms-card { background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; text-align: center; border: 1px solid transparent; transition: 0.2s; }
            .ms-card:hover { border-color: rgba(88, 101, 242, 0.5); background: rgba(255,255,255,0.1); }
            .ms-val { font-size: 20px; font-weight: bold; color: #5865F2; }
            .ms-lab { font-size: 10px; color: #b5bac1; text-transform: uppercase; font-weight: 700; }
        `);

        this.patchMessages();
        BdApi.UI.showToast("MyStatsPro: Tracking active!");
    }

    loadData() {
        const saved = BdApi.Data.load("MyStatsPro", "stats");
        if (saved) this.data = saved;
    }

    patchMessages() {
        const MessageActions = BdApi.Webpack.getModule(m => m.sendMessage && m.editMessage);
        if (!MessageActions) return;

        BdApi.Patcher.after("MyStatsPro", MessageActions, "sendMessage", () => {
            this.data.messages++;
            this.save();
        });
    }

    save() {
        BdApi.Data.save("MyStatsPro", "stats", this.data);
    }

    getSettingsPanel() {
        const root = document.createElement("div");
        root.className = "ms-glass-panel";
        root.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin:0">Activity Stats</h2>
                <a href="https://github.com/SoulxLowEater/MyStatsPro" target="_blank" style="color: #5865F2; font-size: 12px; text-decoration: none;">GitHub Repo</a>
            </div>
            <div class="ms-stat-grid">
                <div class="ms-card"><div class="ms-lab">Total Msg</div><div class="ms-val">${this.data.messages}</div></div>
                <div class="ms-card"><div class="ms-lab">Daily</div><div class="ms-val">${this.data.messages}</div></div>
                <div class="ms-card"><div class="ms-lab">Status</div><div class="ms-val" style="color: #3ba55c;">Online</div></div>
            </div>
        `;
        return root;
    }

    stop() {
        BdApi.DOM.removeStyle("MyStatsStyles");
        BdApi.Patcher.unpatchAll("MyStatsPro");
    }
};