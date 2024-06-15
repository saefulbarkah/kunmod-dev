"use strict";
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const puerts_1 = require("puerts"),
  UE = require("ue"),
  InputSetting_1 = require("../Game/InputSettings/InputSettings"),
  ResourceSystem_1 = require("../Core/Resource/ResourceSystem"),
  GlobalData_1 = require("../Game/GlobalData"),
  GameProcedure_1 = require("./GameProcedure"),
  ModManager_1 = require("./Manager/ModManager"),
  ModLanguage_1 = require("./Manager/ModFuncs/ModLanguage"),
  EntityManager_1 = require("./Manager/ModFuncs/EntityManager"),
  AutoAbsorb_1 = require("./Manager/ModFuncs/AutoAbsorb"),
  KillAura_1 = require("./Manager/ModFuncs/KillAura"),
  AutoChest_1 = require("./Manager/ModFuncs/AutoChest"),
  ESP_1 = require("./Manager/ModFuncs/ESP"),
  AutoDestroy_1 = require("./Manager/ModFuncs/AutoDestroy"),
  UiManager_1 = require("./Ui/UiManager");
const { ModUtils } = require("./Manager/ModFuncs/ModUtils");

const ModManager = ModManager_1.ModManager,
  ModLanguage = ModLanguage_1.ModLanguage,
  EntityManager = EntityManager_1.ModsEntityManager;

let keyState = false,
  Menu = null,
  isMenuLoaded = false,
  isMenuShow = false,
  currentLang = "en",
  loadMenuInterval = null;

function main() {
  var e = puerts_1.argv.getByName("GameInstance");
  GameProcedure_1.GameProcedure.Start(e);
}

class MainMenu {
  static IsKey(str) {
    var IsInputKeyDown_1 = InputSetting_1.InputSettings.IsInputKeyDown(str);
    var IsInputKeyDown_LeftControl =
      InputSetting_1.InputSettings.IsInputKeyDown("LeftAlt");
    if (IsInputKeyDown_LeftControl && IsInputKeyDown_1 && !keyState) {
      IsInputKeyDown_1 = false;
      IsInputKeyDown_LeftControl = false;
      keyState = true;
      return true;
    }
    if (IsInputKeyDown_1 === false) {
      keyState = false;
      return false;
    }
    return false;
  }

  static ListenKey() {
    ModManager.listenModsToggle();
    InputSetting_1.InputSettings.AddActionMapping("", "LeftAlt");
    InputSetting_1.InputSettings.AddActionMapping("", "X");

    if (MainMenu.IsKey("X") === true) {
      if (isMenuShow) {
        Menu.SetVisibility(0);
      } else {
        MainMenu.getTranslation();
        Menu.KillAuraValue.ClearOptions();
        for (const option in MainMenu.killAura()) {
          Menu.KillAuraValue.AddOption(MainMenu.killAura()[option]);
        }
        Menu.KillAuraValue.SetSelectedIndex(ModManager.Settings.killAuraState);
        Menu.SetVisibility(2);
      }
      isMenuShow = !isMenuShow;
    }
    MainMenu.updateMenuState();
  }

  static KunLog(string) {
    var info = string.toString();
    puerts_1.logger.info("[KUNMOD:]" + info);
  }

  static Start() {
    if (!isMenuLoaded) {
      currentLang = ModLanguage.GetCurrLang();

      Menu = UE.UMGManager.CreateWidget(
        GlobalData_1.GlobalData.World,
        ResourceSystem_1.ResourceSystem.Load(
          "/Game/Aki/ModMenu.ModMenu_C",
          UE.Class
        )
      );

      if (Menu) {
        try {
          Menu.Yinlin.SetBrushFromTexture(
            ResourceSystem_1.ResourceSystem.Load(
              "/Game/Aki/Yinlin.Yinlin",
              UE.Texture
            )
          );

          Menu.TitleBar.SetBrushFromTexture(
            ResourceSystem_1.ResourceSystem.Load(
              "/Game/Aki/Gradient.Gradient",
              UE.Texture
            )
          );

          MainMenu.updateMenuState();

          // translate
          MainMenu.getTranslation();

          Menu.GodModeCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.GodMode = isChecked;
            MainMenu.KunLog("God Mode: " + isChecked);
          });

          Menu.NoCDCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.NoCD = isChecked;
            MainMenu.KunLog("No Cooldown: " + isChecked);
          });

          Menu.AutoPickTreasureCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AutoPickTreasure = isChecked;
            MainMenu.KunLog("Auto Pick Treasure: " + isChecked);
          });

          Menu.AutoAbsorbEchoCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AutoAbsorb = isChecked;
            MainMenu.KunLog("Auto Absorb: " + isChecked);
          });

          Menu.HitMultiplierCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.HitMultiplier = isChecked;
            MainMenu.KunLog("Hit Multiplier: " + isChecked);
          });

          Menu.HitMultiplierCount.OnTextChanged.Add((value) => {
    
            if (isNaN(value)) {
              value = 1
              Menu.HitMultiplierCount.SetText(value)
            }
            ModManager.Settings.Hitcount = value;
            MainMenu.KunLog("Hit Multiplier Count: " + value);
          });

          Menu.KillAuraCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.killAura = isChecked;
            MainMenu.KunLog("Kill Aura: " + isChecked);
          });

          for (const option in MainMenu.killAura()) {
            Menu.KillAuraValue.AddOption(MainMenu.killAura()[option]);
          }

          Menu.KillAuraValue.OnSelectionChanged.Add((selectedItem) => {
            if (selectedItem) {
              ModManager.Settings.killAuraState =
                MainMenu.killAura().indexOf(selectedItem);
              MainMenu.KunLog("Kill Aura Value: " + selectedItem);
            }
          });

          Menu.AntiDitherCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AntiDither = isChecked;
            MainMenu.KunLog("Anti Dither: " + isChecked);
          });

          Menu.InfiniteStaminaCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.InfiniteStamina = isChecked;
            MainMenu.KunLog("Inifnite Stamina: " + isChecked);
          });

          Menu.AutoLootCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AutoLoot = isChecked;
            MainMenu.KunLog("Auto Loot: " + isChecked);
          });

          Menu.PerceptionRangeCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.PerceptionRange = isChecked;
            MainMenu.KunLog("Perception Range: " + isChecked);
          });

          Menu.PlayerSpeedCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.PlayerSpeed = isChecked;
            MainMenu.KunLog("Player Speed: " + isChecked);
            MainMenu.updatePlayerSpeed();
          });

          Menu.PlayerSpeedValue.OnTextChanged.Add((value) => {
    
            if (isNaN(value)) {
              value = 1;
              Menu.PlayerSpeedValue.SetText(value)
            }
            ModManager.Settings.playerSpeedValue = value;
            MainMenu.KunLog("Player Speed Value: " + value);
            MainMenu.updatePlayerSpeed();
          });

          Menu.CustomUidSubmit.OnClicked.Add(() => {
            const UID = Menu.CustomUidValue.GetText();
            ModManager.ChangeUid(UID);
            MainMenu.KunLog("UID Changed: " + UID);
          });

          Menu.HideHUDCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.HideHUD = isChecked;
            if (isChecked) {
              UiManager_1.UiManager.CloseView("BattleView");
              UiManager_1.UiManager.CloseView("UidView");
            } else {
              UiManager_1.UiManager.OpenView("BattleView");
              UiManager_1.UiManager.OpenView("UidView");
            }
            MainMenu.KunLog("UID Hide: " + isChecked);
          });

          Menu.HideDmgCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.HideDmgUi = isChecked;
            MainMenu.KunLog("Hide Damage Text: " + isChecked);
          });

          Menu.AutoMineCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AutoMine = isChecked;
            MainMenu.KunLog("Auto Mining: " + isChecked);
          });

          Menu.CustomTPCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.CustomTp = isChecked;
            MainMenu.KunLog("Custom Teleport: " + isChecked);
          });

          Menu.MarkTPCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.MarkTp = isChecked;
            MainMenu.KunLog("Mark Teleport: " + isChecked);
          });

          Menu.DebugEntityCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.DebugEntity = isChecked;
            MainMenu.KunLog("Debug Entity: " + isChecked);
          })

          Menu.AutoDestroyCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AutoDestroy = isChecked;
            MainMenu.KunLog("Auto Destroy: " + isChecked);
          })

          Menu.NewAutoAbsorbCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.AutoAbsorbnew = isChecked;
            MainMenu.KunLog("New Auto Absorb: " + isChecked);
          })

          Menu.NewKillAuraCheck.OnCheckStateChanged.Add((isChecked) => {
            ModManager.Settings.killAuranew = isChecked;
            MainMenu.KunLog("New Kill Aura: " + isChecked);
          })

          Menu.NewKillAuraRadius.OnTextChanged.Add((value) => {
    
            if (isNaN(value)) {
              value = 500;
              Menu.NewKillAuraRadius.SetText(value)
            }
            ModManager.Settings.killAuraRadius = value;
            MainMenu.KunLog("New Kill Aura Radius: " + value);
          });

          Menu.KillAuraValue.SetSelectedIndex(
            ModManager.Settings.killAuraState
          );
          Menu.PlayerSpeedValue.SetText(ModManager.Settings.playerSpeedValue);
          Menu.HitMultiplierCount.SetText(ModManager.Settings.Hitcount);
          Menu.CustomUidValue.SetText(ModManager.Settings.Uid);
          Menu.NewKillAuraRadius.SetText(ModManager.Settings.killAuraRadius);
        } catch (e) {
          MainMenu.KunLog(e);
        }

        Menu.AddToViewport();
        Menu.SetVisibility(0);
        isMenuLoaded = true;
        MainMenu.KunLog("KUN-MOD Menu Loaded!");
        clearInterval(loadMenuInterval);
      }
    }
  }

  static getTranslation() {
    if (Menu) {
      Menu.HeadingPlayer.SetText(ModLanguage.ModTr("Player"));
      Menu.HeadingWorld.SetText(ModLanguage.ModTr("World"));
      Menu.HeadingUI.SetText(ModLanguage.ModTr("UI"));
      Menu.HeadingTeleport.SetText(ModLanguage.ModTr("Teleport"));
      Menu.HeadingDebug.SetText(ModLanguage.ModTr("Debug"));

      Menu.GodModeText.SetText(ModLanguage.ModTr("God Mode [F5]"));
      Menu.NoCDText.SetText(ModLanguage.ModTr("No Cooldown [F11]"));
      Menu.AutoPickTreasureText.SetText(
        ModLanguage.ModTr("Auto Pick Treasure [F7]")
      );
      Menu.AutoAbsorbEchoText.SetText(ModLanguage.ModTr("Auto Absorb [F8]"));
      Menu.HitMultiplierText.SetText(ModLanguage.ModTr("Hit Multiplier [F6]"));
      Menu.KillAuraText.SetText(ModLanguage.ModTr("Kill Aura [F9]"));
      Menu.AntiDitherText.SetText(ModLanguage.ModTr("Anti Dither"));
      Menu.InfiniteStaminaText.SetText(ModLanguage.ModTr("Infinite Stamina"));
      Menu.AutoLootText.SetText(ModLanguage.ModTr("Auto Loot [Num0]"));
      Menu.PerceptionRangeText.SetText(
        ModLanguage.ModTr("Perception Range [F10]")
      );
      Menu.PlayerSpeedText.SetText(ModLanguage.ModTr("Player Speed [F12]"));
      Menu.CustomUidText.SetText(ModLanguage.ModTr("Custom UID"));
      Menu.HideHUDText.SetText(ModLanguage.ModTr("Hide HUD"));
      Menu.HideDmgText.SetText(ModLanguage.ModTr("Hide Damage Text"));
      Menu.MarkTPText.SetText(ModLanguage.ModTr("Mark Teleport [T]"));
      Menu.CustomTPText.SetText(ModLanguage.ModTr("Custom Teleport [INS]"));
      Menu.AutoMineText.SetText(ModLanguage.ModTr("Auto Mining [Num1]"));
      
      Menu.DebugEntityText.SetText(ModLanguage.ModTr("Debug Entity"));
      Menu.AutoDestroyText.SetText(ModLanguage.ModTr("Auto Destroy"));
      Menu.NewKillAuraText.SetText(ModLanguage.ModTr("New Kill Aura"));
      Menu.NewAutoAbsorbText.SetText(ModLanguage.ModTr("New Auto Absorb"));

      Menu.DonateText.SetText(ModLanguage.ModTr("Donate:"));
      Menu.Designer.SetText(ModLanguage.ModTr("GUI by n0bu"));
      Menu.DisclaimerText.SetText(ModLanguage.ModTr("This hack is completely free, if you paid to get this, you have been scammed."));
    }
  }

  static updateMenuState() {
    if (Menu) {
      Menu.GodModeCheck.SetIsChecked(ModManager.Settings.GodMode);
      Menu.AutoPickTreasureCheck.SetIsChecked(
        ModManager.Settings.AutoPickTreasure
      );
      Menu.AutoAbsorbEchoCheck.SetIsChecked(ModManager.Settings.AutoAbsorb);
      Menu.HitMultiplierCheck.SetIsChecked(ModManager.Settings.HitMultiplier);
      Menu.KillAuraCheck.SetIsChecked(ModManager.Settings.killAura);
      Menu.AntiDitherCheck.SetIsChecked(ModManager.Settings.AntiDither);
      Menu.InfiniteStaminaCheck.SetIsChecked(
        ModManager.Settings.InfiniteStamina
      );
      Menu.AutoLootCheck.SetIsChecked(ModManager.Settings.AutoLoot);
      Menu.PerceptionRangeCheck.SetIsChecked(
        ModManager.Settings.PerceptionRange
      );
      Menu.PlayerSpeedCheck.SetIsChecked(ModManager.Settings.PlayerSpeed);
      Menu.HideHUDCheck.SetIsChecked(ModManager.Settings.HideHUD);
      Menu.HideDmgCheck.SetIsChecked(ModManager.Settings.HideDmgUi);
      Menu.AutoMineCheck.SetIsChecked(ModManager.Settings.AutoMine);
      Menu.MarkTPCheck.SetIsChecked(ModManager.Settings.MarkTp);
      
      Menu.DebugEntityCheck.SetIsChecked(ModManager.Settings.DebugEntity);
      Menu.AutoDestroyCheck.SetIsChecked(ModManager.Settings.AutoDestroy);
      Menu.NewAutoAbsorbCheck.SetIsChecked(ModManager.Settings.AutoAbsorbnew);
      Menu.NewKillAuraCheck.SetIsChecked(ModManager.Settings.killAuranew);
    }
  }

  static updatePlayerSpeed() {
    if (ModManager.Settings.PlayerSpeed) {
      ModManager.SetPlayerSpeed(ModManager.Settings.playerSpeedValue);
    } else {
      ModManager.SetPlayerSpeed(1);
    }
  }

  static killAura() {
    return [ModLanguage.ModTr("Only Hatred"), ModLanguage.ModTr("Infinity")];
  }
}
class ModEntityListener {
  static Runtime() {
    if (!ModManager.Settings.DebugEntity) return;
    if (!ModUtils.isInGame) return;

    EntityManager.PushEntityList();
    const entitylist = EntityManager.ModsEntitys.EntityList;
    const count = EntityManager.ModsEntitys.EntityCount;
    for (let i = 0; i < count; i++) {
      //AutoAbsorb_1.AutoAbsorb.AutoAbsorb(entitylist[i]);
      // KillAura_1.KillAura.killAura(entitylist[i]);
      //KillAura_1.KillAura.KillAnimal(entitylist[i]);
      //AutoDestroy_1.AutoDestroy.AutoDestroy(entitylist[i]);
      //AutoChest_1.AutoChest.RewardChest(entitylist[i]);
      //ESP_1.ESP.ESPDrawMain(entitylist[i]);
    }

    //puerts_1.logger.warn("kun:Runtime is working");
  }
}
class ESPmain {
  //esp测试test
  static RuntimeESP() {
    if (!ModUtils.isInGame) return;
    ESP_1.ESP.ESPDrawMain();
  }
}

loadMenuInterval = setInterval(MainMenu.Start, 3000);
setInterval(MainMenu.ListenKey, 1);
setInterval(ModEntityListener.Runtime, 1000);
setInterval(ESPmain.RuntimeESP, 1);
main();

exports.ESPmain = ESPmain;
exports.MainMenu = MainMenu;
exports.ModEntityListener = ModEntityListener;
//# sourceMappingURL=Main.js.map
