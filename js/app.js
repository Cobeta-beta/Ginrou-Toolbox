window.addEventListener('DOMContentLoaded', function() {
  var actionLock = false,
      currentHardware = Wallace.getSystemProperty('ro.hardware'),
      enableNokiaActions = (Wallace.getSystemProperty('ro.product.brand') === 'Nokia'),
      enableSim2Actions = (Wallace.getSystemProperty('persist.radio.multisim.config') === 'dsds'),
      enableQualcommActions = (currentHardware === 'qcom'),
      enableMtkActions = (currentHardware === 'mt6572' || currentHardware.slice(0,5) === 'mt673'),
      currentKaiosVersion = Wallace.getSystemPreference('b2g.version'),
      enableCallRecordingActions = (parseInt(currentKaiosVersion.replace(/[^\d]/g,'')) >= 252),
      enableImeiActions = enableNokiaActions || enableMtkActions
  
  if(!enableNokiaActions)
    [].forEach.call(document.querySelectorAll('.nokiaonly'), function(el) {
      el.classList.remove('danger')
      el.classList.add('disabled')
    })

  if(!enableImeiActions)
    [].forEach.call(document.querySelectorAll('.imeionly'), function(el) {
      el.classList.remove('danger')
      el.classList.add('disabled')
    })

  if(!enableSim2Actions)
    [].forEach.call(document.querySelectorAll('.sim2only'), function(el) {
      el.classList.remove('danger')
      el.classList.add('disabled')
    })

  if(!enableQualcommActions)
    [].forEach.call(document.querySelectorAll('.qualcommonly'), function(el) {
      el.classList.remove('danger')
      el.classList.add('disabled')
    })

  if(!enableCallRecordingActions)
    document.querySelector('.callrec').classList.add('disabled')
  
  var overclockScript = [
    'echo 96 > /sys/devices/system/cpu/cpufreq/interactive/target_loads',
    'echo 1094400 > /sys/devices/system/cpu/cpufreq/interactive/hispeed_freq',
    'echo 24 > /sys/devices/system/cpu/cpufreq/interactive/go_hispeed_load',
    'echo 0 > /sys/module/msm_thermal/core_control/enabled'
  ].join(' && ')
  
  var rootingScript = [
    'mount -o remount,rw /',
    'sleep 0.5',
    'stop adbd',
    'mv /sbin/adbd /sbin/adbd.orig',
    'cp /data/local/tmp/adbd /sbin/adbd',
    'chown root:root /sbin/adbd && chmod 750 /sbin/adbd',
    'mount -o remount,ro /',
    'rm /data/local/tmp/adbd',
    'sleep 0.5',
    'start adbd'
  ].join(';')
  
  window.addEventListener('keydown', function(e) {
    if(!actionLock) {
      switch(e.key) {
        case '1': //enable ADB root access until reboot
          Wallace.extractAppAsset('wallace-toolbox.bananahackers.net', 'rsrc/adbd.bin', '/data/local/tmp/adbd', function() {  
            Wallace.runCmd(rootingScript, function() {
              window.alert('Root ADB до перезагрузки')
            }, function() {
              window.alert('Что-то пошло не так: ' + this.error.name)
            })
          })
          break
        case '2': //call recording AUTO/ON/OFF
          if(enableCallRecordingActions) {
            Wallace.getSystemSetting('callrecording.mode', function(curMode) {
              var nextMode = 'on'
              if(curMode === 'auto') nextMode = 'off'
              else if(curMode === 'on') nextMode = 'auto'
              Wallace.enableCallRecording(nextMode, 'wav', function() {
                var msgs = {
                  'on': 'включена',
                  'auto': 'поставленна на автоматический режим',
                  'off': 'выключенна'
                }
                window.alert('Запись звонков ' + msgs[nextMode])
              }, function(e) {
                window.alert('Ошибка: ' + e)
              })
            }, function(e) {
              window.alert('Ошибка: ' + e)
            })
          } else window.alert('Извините, Запись звонков доступно в KaiOS 2.5.2 и выше, а у вас' + currentKaiosVersion)
          break
        case '3': //install app package
          actionLock = true
          var pickPackage = new MozActivity({name: "pick"})
          pickPackage.onsuccess = function() {
            Wallace.installPkg(this.result.blob, function() {
              window.alert('Приложение ' + pickPackage.result.blob.name + ' успешно установленно')
              actionLock = false
            }, function(e) {
              if(e.toString() === 'InvalidPrivilegeLevel')
                window.alert('Недостаточно прав. Включите меню разроботчика (#) перед попыткой установить пакет приложения.')
              else
                window.alert('Ошибка установки приложения: ' + e)
              actionLock = false
            })
          }
          pickPackage.onerror = function(e) {
            window.alert('Ошибка выбора пакета приложения: ' + e.name)
            actionLock = false
          }
          break
        case '4': //override TTL
          if(enableQualcommActions) {
            actionLock = true
            var newTTL = parseInt(window.prompt('Новое TTL значение', 64))
            if(newTTL && newTTL < 256) {
              Wallace.fixTTL(newTTL, function() {
                window.alert('TTL исправлен на ' + newTTL + ' до перезагрузки')
                actionLock = false
              }, function(e) {
                window.alert('Ошибка: ' + e)
                actionLock = false
              }, enableMtkActions ? 'ccmni0' : 'rmnet_data0')
            }
            else {
              window.alert('Неверное TTL значание')
              actionLock = false
            }
          }
          else window.alert('Ошибка: TTL Может быть перезаписан только на Qualcomm ')
          break
        case '5': //Edit IMEI1
          if(enableNokiaActions) {
            if(window.confirm('Вы уверены что хотите поменять IMEI1?')) {
              var newIMEI = window.prompt('Новый IMEI1', Wallace.generateRandomIMEI())
              if(newIMEI) {
                actionLock = true
                Wallace.setNokiaIMEI(1, newIMEI, function() {
                  if(window.confirm('IMEI1 заменён на ' + newIMEI + '. перезагрузится для применения??'))
                    Wallace.reboot()
                  actionLock = false
                }, function(e) {
                  window.alert('Ошибка: неверный IMEI')
                  actionLock = false
                })
              }
            }
            break
          } else if(enableMtkActions) {
            if(window.confirm('Вы уверены что хотите поменять IMEI1?')) {
              var newIMEI = window.prompt('Новый IMEI1', Wallace.generateRandomIMEI())
              if(newIMEI) {
                actionLock = true
                Wallace.setMtkIMEI(1, newIMEI, function() {
                  if(window.confirm('IMEI1 заменён на ' + newIMEI + '. перезагрузится для применения?'))
                    Wallace.reboot()
                  actionLock = false
                }, function(e) {
                  window.alert('Ошибка: неверный IMEI')
                  actionLock = false
                })
              }
            }
            break
          } else window.alert('Ошибка: IMEI редактор создан для Nokia и MTK процесоров')
          break
        case '6': //Edit IMEI2
          if(enableNokiaActions) {
            if(enableSim2Actions) {
              if(window.confirm('Вы уверены что хотите поменять IMEI2?')) {
                var newIMEI = window.prompt('Новый IMEI2', Wallace.generateRandomIMEI())
                if(newIMEI) {
                  actionLock = true
                  Wallace.setNokiaIMEI(2, newIMEI, function() {
                    if(window.confirm('IMEI2 заменён на ' + newIMEI + '. перезагрузится для применения?'))
                      Wallace.reboot()
                    actionLock = false
                  }, function(e) {
                    window.alert('Ошибка: неверный IMEI')
                    actionLock = false
                  })
                }
              }
              break
            } else window.alert('Ошибка: попытка изменить IMEI2 на одно-сим конфигурации')
          } else if(enableMtkActions) {
            if(enableSim2Actions) {
              if(window.confirm('Вы уверены что хотите поменять IMEI2?')) {
                var newIMEI = window.prompt('Новый IMEI2', Wallace.generateRandomIMEI())
                if(newIMEI) {
                  actionLock = true
                  Wallace.setMtkIMEI(2, newIMEI, function() {
                    if(window.confirm('IMEI2 заменён на' + newIMEI + '. перезагрузится для применения?'))
                      Wallace.reboot()
                    actionLock = false
                  }, function(e) {
                    window.alert('Ошибка: неверный IMEI')
                    actionLock = false
                  })
                }
              }
              break
            } else window.alert('Ошибка: попытка изменить IMEI2 на одно-сим конфигурации')
          } else window.alert('Ошибка: IMEI редактор создан для Nokia и MTK процесоров')
          break
        case '7': //Proxy on/off
          Wallace.getSystemSetting('browser.proxy.enabled', function(res) {
            var newVal = !(res === true)
            Wallace.setSystemSetting('browser.proxy.enabled', newVal, function() {
              window.alert('Прокси ' + (newVal ? 'включен' : 'выключен') + ' успешно')
            }, function(e) {
              window.alert('Ошибка ' + (newVal ? 'включения' : 'выключения') + ' прокси: ' + e)
            })
          }, function(e) {
            window.alert('Ошибка: ' + e)
          })
          break
        case '8': //Установить proxy host/port
          actionLock = true
          Wallace.getSystemSetting('browser.proxy.host', function(oldHost) {
            Wallace.getSystemSetting('browser.proxy.port', function(oldPort) {
              var newHost = window.prompt('Прокси хост', oldHost || '')
              var newPort = Number(window.prompt('Прокси порт', oldPort || ''))
              if(newHost && newPort) {
                Wallace.setSystemSetting('browser.proxy.host', newHost, function() {
                  Wallace.setSystemSetting('browser.proxy.port', newPort, function() {
                    window.alert('Прокси установлен успешно')
                    actionLock = false
                  }, function(e) {
                    window.alert('Ошибка установки порта прокси: ' + e)
                    actionLock = false
                  })
                }, function(e) {
                  window.alert('Ошибка настройки хоста прокси: ' + e)
                  actionLock = false
                })
              }
              else {
                window.alert('Ошибка: Нельзя установить пустые значения для хоста или порта')
                actionLock = false
              }
            }, function(e) {
              window.alert('Ошибка: ' + e)
              actionLock = false
            })
          }, function(e) {
            window.alert('Ошибка: ' + e)
            actionLock = false
          })
          break
        case '9': //override the user agent
          if(window.confirm('Вы уверены что хотите изменить пользовательский агент? Без WebIDE или сброса к заводским настройкам отменнить данное действие не получится')) {
            actionLock = true
            var newUA = window.prompt('Агент пользователя', navigator.userAgent)
            if(newUA === '') newUA = navigator.userAgent
            Wallace.setUserAgent(newUA)
            actionLock = false
          }
          break
        case '*': //run overclock script
           if(enableQualcommActions) {
             actionLock = true
             Wallace.runCmd(overclockScript, function() {
               window.alert('Разгон до перезагрузки')
               actionLock = false
             }, function(e) {
               window.alert('Ошибка: ' + e)
               actionLock = false
             })
           }
           else alert('Ошибка: Разгон возможен только для Qualcomm устройств')
          break
        case '0': //toggle diag port
          if(enableQualcommActions) {
            Wallace.toggleDiagPort(function() {
              window.alert('DIAG порт включен')
            }, function() {
              window.alert('DIAG порт выключен')
            }, function(e) {
              window.alert('Ошибка переключения DIAG порта: ' + e)
            })
          }
          else window.alert('Ошибка: DIAG порт может быть использован только на Qualcomm ')
          break
        case '#': //developer menu
          if(window.confirm('Включить меню разроботчика и перезагрузится?'))
            Wallace.runCmd('echo -n root > /cache/__post_reset_cmd__;cp /cache/__post_reset_cmd__ /persist/__post_reset_cmd__', function() {
              Wallace.reboot()
            }, function(e) {
              window.alert('Ошибка: ' + e)
            })
          break
        case 'Call': //set Wi-Fi MAC address
          if(enableNokiaActions) {
            var newMAC = window.prompt('Новый Wi-Fi MAC', Wallace.generateRandomMAC())
            if(newMAC) {
             actionLock = true
             Wallace.setNokiaWlanMAC(newMAC, function() {
               if(window.confirm('MAC изменён на ' + newMAC + '. перезагрузится для применения?'))
                 Wallace.reboot()
                 actionLock = false
             }, function(e) {
               window.alert('Ошибка: Неверный MAC')
               actionLock = false
             })
            }
          }
          else if(enableMtkActions) {
            var newMAC = window.prompt('Новый Wi-Fi MAC', Wallace.generateRandomMAC())
            if(newMAC) {
             actionLock = true
             Wallace.setMtkWlanMAC(newMAC, function() {
               window.alert('MAC изменён на ' + newMAC + '. Включите и выключите Wi-Fi чтобы применить до перезагрузки')
               actionLock = false
             }, function(e) {
               window.alert('Ошибка: неверный MAC')
               actionLock = false
             })
            }
          }
          else window.alert('Ошибка: Изменение Wi-Fi MAC доступно только на Nokia и MTK')
          break  
        case 'SoftLeft': //set Bluetooth MAC address
          if(enableNokiaActions) {
            var newMAC = window.prompt('Новый Bluetooth MAC', Wallace.generateRandomMAC())
            if(newMAC) {
             actionLock = true
             Wallace.setNokiaBluetoothMAC(newMAC, function() {
               if(window.confirm('MAC изменён на ' + newMAC + '. перезагрузится для применения?'))
                 Wallace.reboot()
                 actionLock = false
             }, function(e) {
               window.alert('Ошибка: неверный MAC')
               actionLock = false
             })
            }
          }
          else window.alert('Error: Изменение Bluetooth MAC доступно только на Nokia')
          break  
        case 'SoftRight':
          if(window.confirm('Вы действительно хотите сделать все пред-установленные программы удаляемыми из меню (требуется Busybox) и перезагрузится?')) {
            Wallace.runCmd('busybox sed -i \'s#"removable": false#"removable": true#g\' /data/local/webapps/webapps.json', function() {
              Wallace.reboot()
            }, function(e) {
              window.alert('Error: ' + e)
            })
          }  
          break
        default:
          break
      }
    }
  })
}, false)
