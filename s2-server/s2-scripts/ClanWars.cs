using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using Newtonsoft.Json;
using Teal;

/* 
Author: Anna
Description: Basic s2 server script to coinside with the s2 clan war discord bot
Credits: Noerw and AL for scripting help
*/

public class ClanWars: MonoBehavior {
    public int serverId = 1;
    Match match;

    private void Awake() {
        if (!Net.IsServer) return;
        Eventor.AddListener(Events.Player_Joined, OnPlayerJoined);
        Eventor.AddListener(Events.End_Condition, OnEndCondition);
        GameChat.instance.OnChat.AddListener(OnPlayerChat);
    }

    void Start() {
        match = GetComponent<Match>();
    }

    private void OnDestroy() {
        if (!Net.IsServer) return;
        Eventor.RemoveListener(Events.Player_Joined, OnPlayerJoined);
        Eventor.RemoveListener(Events.End_Condition, OnEndCondition);
        GameChat.instance.OnChat.RemoveListener(OnPlayerChat);
    }

    void OnPlayerJoined(IGameEvent ev) {
        Player p = ((GlobalPlayerEvent)ev).Player;
        string playfabId = (string)p.props["account"];

        //Adds all players to spec
        p.props["team"] = 5;

        //Send request to BOT
    }

    void OnEndCondition(IGameEvent e) {
        //Send request to BOT
    }

    void OnPlayerChat(Player p, string msg) {
        if (!Net.IsServer || p == null || (int)p.props["team"] == 5)
            return;

        if (msg == "!p" || msg == "!pause") 
                UnityEngine.Time.timeScale = 0;
        else if (msg == "!g" || msg == "!go") UnityEngine.Time.timeScale = 1;
        else if (msg == "!r" || msg == "!restart") match.Master_Restart();
        else if (msg.StartsWith("!map")) {
            string[] args = msg.Split(" ");
            string mapName = args[1];
            GamesCycle.Game game = GamesCycle.instance.game;
		    MonoSingleton<Lobby>.Get.NoLobbyOnNextMatch();
		    GamesCycle.instance.Master_LoadGame(game.rules, mapName, game.modifiers);
        }
    }
}