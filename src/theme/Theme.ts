import { IAppTheme, IKioskTheme, IKioskThemeData } from "@djonnyx/tornado-types";

export const THEMES_FILE_NAME = "themes.json";

export const compileThemes = (themes: Array<IAppTheme<IKioskThemeData>>, name: string): IKioskTheme => {
    const result: IKioskTheme = {
        name,
        themes: {},
    };

    themes.forEach(t => {
        result.themes[t.id!] = t.data;
    });

    return result;
}

/**
 * Embeded theme
 */
export const theme: IKioskTheme = {
    name: "light",
    themes: {
        ["light"]: {
            configuration: {
                showDraftOrder: true,
            },
            common: {
                modal: {
                    backgroundColor: "#e3e3e3",
                    window: {
                        backgroundColor: "transparent",
                    }
                },
                modalTransparent: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    window: {
                        backgroundColor: "#fff",
                        borderColor: "rgba(0,0,0,0.1)"
                    }
                },
                modalNotification: {
                    backgroundColor: "none",
                    window: {
                        backgroundColor: "rgba(0,0,0,0.75)",
                        borderColor: "rgba(0,0,0,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 20,
                },
                alert: {
                    titleColor: "rgba(0,0,0,0.75)",
                    titleFontSize: 20,
                    messageColor: "rgba(0,0,0,0.75)",
                    messageFontSize: 18,
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                    buttonTextFontSize: 14,
                }
            },
            languageModal: {
                item: {
                    backgroundColor: "#fff",
                    borderColor: "transparent",
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 16,
                }
            },
            languagePicker: {
                borderColor: "rgba(0,0,0,0.75)",
            },
            orderTypeModal: {
                item: {
                    backgroundColor: "#fff",
                    borderColor: "transparent",
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 16,
                }
            },
            orderTypePicker: {
                backgroundColor: "transparent",
                borderColor: "#212121",
                textColor: "#212121",
                textFontSize: 13,
            },
            service: {
                errorLabel: {
                    textColor: "red",
                    textFontSize: 12,
                },
                textInput: {
                    placeholderColor: "rgba(0,0,0,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(0,0,0,1)",
                    textFontSize: 16,
                },
                picker: {
                    textColor: "rgba(0,0,0,1)",
                    textFontSize: 16,
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                }
            },
            loading: {
                backgroundColor: "#fff",
                progressBar: {
                    thumbColor: "rgba(0,0,0,0.85)",
                    trackColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 13,
                }
            },
            intro: {
                backgroundColor: "#fff",
            },
            menu: {
                backgroundColor: "#fff",
                header: {
                    backgroundColor: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"],
                    titleColor: "rgba(0,0,0,0.75)",
                    titleFontSize: 32,
                },
                orderPanel: {
                    backgroundColor: "rgba(0,0,0,0.025)",
                },
                backButton: {
                    iconColor: "rgba(0,0,0,0.75)",
                },
                sideMenu: {
                    item: {
                        backgroundColor: "#000",
                        nameColor: "rgba(0,0,0,0.75)",
                        nameFontSize: 14,
                    },
                },
                navMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                        nameFontSize: 20,
                        descriptionColor: "rgba(0,0,0,0.5)",
                        descriptionFontSize: 12,
                        discount: {
                            backgroundColor: "red",
                            textColor: "white",
                            textFontSize: 12,
                        },
                        price: {
                            borderColor: "rgba(0,0,0,0.5)",
                            textColor: "rgba(0,0,0,0.5)",
                            textFontSize: 16,
                        }
                    }
                },
                sum: {
                    price: {
                        textColor: "rgba(0,0,0,0.75)",
                        textFontSize: 18,
                    },
                },
                draftOrder: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                        nameFontSize: 14,
                        price: {
                            borderColor: "rgba(0,0,0,0.5)",
                            textColor: "rgba(0,0,0,0.75)",
                            textFontSize: 14,
                        },
                        quantityStepper: {
                            buttons: {
                                backgroundColor: "#30a02a",
                                disabledBackgroundColor: "#30a02a40",
                                borderColor: "rgba(0,0,0,0.75)",
                                disabledBorderColor: "rgba(0,0,0,0.75)",
                                textColor: "rgba(255,255,255,1)",
                                textFontSize: 14,
                                disabledTextColor: "rgba(255,255,255,0.75)",
                            },
                            indicator: {
                                textColor: "rgba(0,0,0,0.75)",
                                textFontSize: 16,
                            }
                        }
                    }
                },
                ctrls: {
                    cancelButton: {
                        backgroundColor: ["#212121", "rgb(242, 62, 26)"],
                        disabledBackgroundColor: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"],
                    },
                    confirmButton: {
                        backgroundColor: ["#30a02a", "#30a02a"],
                        disabledBackgroundColor: ["#30a02a40", "rgba(0, 0, 0, 0.1)"],
                    }
                }
            },
            modifiers: {
                backgroundColor: "#fff",
                nameColor: "rgba(0,0,0,0.75)",
                nameFontSize: 32,
                descriptionColor: "rgba(0,0,0,0.75)",
                descriptionFontSize: 14,
                price: {
                    borderColor: "rgba(0,0,0,0.5)",
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 48,
                },
                group: {
                    nameColor: "rgba(0,0,0,0.75)",
                    descriptionColor: "rgba(0,0,0,0.75)",
                    descriptionInvalidColor: "#ff4e4e",
                    buttonPrevious: {
                        backgroundColor: "#212121",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(0,0,0,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        textFontSize: 26,
                        disabledTextColor: "rgba(0,0,0,0.1)",
                    },
                    buttonNext: {
                        backgroundColor: "#30a02a",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(0,0,0,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        textFontSize: 26,
                        disabledTextColor: "rgba(0,0,0,0.1)",
                    },
                    indicator: {
                        currentValidColor: "#30a02a",
                        currentInvalidColor: "#ff4e4e",
                        otherColor: "#212121",
                    }
                },
                item: {
                    backgroundColor: "transparent",
                    nameColor: "rgba(0,0,0,0.75)",
                    nameFontFontSize: 20,
                    descriptionColor: "rgba(0,0,0,0.5)",
                    descriptionFontSize: 12,
                    discount: {
                        backgroundColor: "red",
                        textColor: "white",
                        textFontSize: 12,
                    },
                    quantitySwitch: {
                        on: {
                            backgroundColor: "#30a02a",
                            borderColor: "#30a02a",
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 16,
                        },
                        off: {
                            backgroundColor: "transparent",
                            borderColor: "rgba(0,0,0,0.75)",
                            textColor: "rgba(0,0,0,0.75)",
                            textFontSize: 16,
                        },
                    },
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "transparent",
                            selectedBackgroundColor: "#30a02a",
                            disabledBackgroundColor: "transparent",
                            disabledSelectedBackgroundColor: "#30a02a40",
                            borderColor: "rgba(0,0,0,0.75)",
                            selectedBorderColor: "transparent",
                            disabledBorderColor: "rgba(0,0,0,0.75)",
                            disabledSelectedBorderColor: "transparent",
                            textColor: "rgba(0,0,0,0.75)",
                            textFontSize: 16,
                            selectedTextColor: "rgba(255,255,255,0.75)",
                            disabledTextColor: "rgba(0,0,0,0.75)",
                            disabledSelectedTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(0,0,0,0.75)",
                            textFontSize: 16,
                        }
                    }
                }
            },
            confirmation: {
                backgroundColor: "#fff",
                backButton: {
                    backgroundColor: "#212121",
                    textColor: "#ffffff",
                    textFontSize: 16,
                },
                nextButton: {
                    backgroundColor: "#30a02a",
                    textColor: "#ffffff",
                    textFontSize: 16,
                },
                summaryPrice: {
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 16,
                },
                nestedItem: {
                    backgroundColor: "transparent",
                    nameColor: "#212121",
                    price: {
                        textColor: "rgba(0,0,0,0.75)",
                        textFontSize: 12,
                    },
                },
                item: {
                    backgroundColor: "transparent",
                    oddBackgroundColor: "rgba(0,0,0,0.025)",
                    nameColor: "rgba(0,0,0,0.75)",
                    nameFontSize: 20,
                    price: {
                        textColor: "rgba(0,0,0,0.75)",
                        textFontSize: 24,
                    },
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "#30a02a",
                            disabledBackgroundColor: "#30a02a40",
                            borderColor: "rgba(0,0,0,0.75)",
                            disabledBorderColor: "rgba(0,0,0,0.75)",
                            textColor: "rgba(255,255,255,1)",
                            textFontSize: 16,
                            disabledTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(0,0,0,0.75)",
                            textFontSize: 16,
                        }
                    }
                }
            },
            payStatus: {
                primaryMessageColor: "rgba(0,0,0,0.75)",
                primaryMessageFontSize: 40,
                secondaryMessageColor: "rgba(0,0,0,0.5)",
                secondaryMessageFontSize: 20,
            },
            payConfirmation: {
                numberColor: "rgba(0,0,0,1)",
                nameFontSize: 76,
                primaryMessageColor: "rgba(0,0,0,0.75)",
                primaryMessageFontSize: 32,
                secondaryMessageColor: "rgba(0,0,0,0.5)",
                secondaryMessageFontSize: 20,
            }
        },
        ["dark"]: {
            configuration: {
                showDraftOrder: true,
            },
            common: {
                modal: {
                    backgroundColor: "#000",
                    window: {
                        backgroundColor: "#000",
                    }
                },
                modalTransparent: {
                    backgroundColor: "rgba(255,255,255,0.075)",
                    window: {
                        backgroundColor: "#000",
                        borderColor: "rgba(255,255,255,0.1)"
                    }
                },
                modalNotification: {
                    backgroundColor: "none",
                    window: {
                        backgroundColor: "rgba(255,255,255,0.75)",
                        borderColor: "rgba(255,255,255,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(0,0,0,0.75)",
                    textFontSize: 20,
                },
                alert: {
                    titleColor: "rgba(255,255,255,0.75)",
                    titleFontSize: 20,
                    messageColor: "rgba(255,255,255,0.75)",
                    messageFontSize: 18,
                    buttonColor: "#30a02a",
                    buttonTextColor: "rgba(255,255,255,1)",
                    buttonTextFontSize: 14,
                }
            },
            languageModal: {
                item: {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 16,
                }
            },
            languagePicker: {
                borderColor: "rgba(255,255,255,0.15)",
            },
            orderTypeModal: {
                item: {
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 16,
                }
            },
            orderTypePicker: {
                backgroundColor: "transparent",
                borderColor: "rgba(255,255,255,0.25)",
                textColor: "rgba(255,255,255,1)",
                textFontSize: 13,
            },
            service: {
                errorLabel: {
                    textColor: "red",
                    textFontSize: 12,
                },
                textInput: {
                    placeholderColor: "rgba(255,255,255,0.5)",
                    selectionColor: "#30a02a",
                    underlineColor: "#30a02a",
                    underlineWrongColor: "red",
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                },
                picker: {
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                    placeholderColor: "gray",
                },
                button: {
                    backgroundColor: "#30a02a",
                    textColor: "rgba(255,255,255,1)",
                    textFontSize: 16,
                }
            },
            loading: {
                backgroundColor: "#000",
                progressBar: {
                    thumbColor: "rgba(255,255,255,0.85)",
                    trackColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 13,
                }
            },
            intro: {
                backgroundColor: "#000",
            },
            menu: {
                backgroundColor: "#000",
                header: {
                    backgroundColor: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"],
                    titleColor: "rgba(255,255,255,0.75)",
                    titleFontSize: 32,
                },
                orderPanel: {
                    backgroundColor: "rgba(255,255,255,0.025)",
                },
                backButton: {
                    iconColor: "rgba(255,255,255,0.75)",
                },
                sideMenu: {
                    item: {
                        backgroundColor: "#fff",
                        nameColor: "rgba(255,255,255,0.75)",
                        nameFontSize: 14,
                    },
                },
                navMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(255,255,255,0.75)",
                        nameFontSize: 20,
                        descriptionColor: "rgba(255,255,255,0.5)",
                        descriptionFontSize: 12,
                        discount: {
                            backgroundColor: "red",
                            textColor: "white",
                            textFontSize: 12,
                        },
                        price: {
                            borderColor: "rgba(255,255,255,0.5)",
                            textColor: "rgba(255,255,255,0.5)",
                            textFontSize: 16,
                        }
                    }
                },
                sum: {
                    price: {
                        textColor: "rgba(255,255,255,0.75)",
                        textFontSize: 18,
                    },
                },
                draftOrder: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(255,255,255,0.75)",
                        nameFontSize: 14,
                        price: {
                            borderColor: "rgba(255,255,255,0.5)",
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 14,
                        },
                        quantityStepper: {
                            buttons: {
                                backgroundColor: "#30a02a",
                                disabledBackgroundColor: "#30a02a40",
                                borderColor: "rgba(0,0,0,0.75)",
                                disabledBorderColor: "rgba(0,0,0,0.75)",
                                textColor: "rgba(255,255,255,1)",
                                textFontSize: 16,
                                disabledTextColor: "rgba(255,255,255,0.75)",
                            },
                            indicator: {
                                textColor: "rgba(255,255,255,0.75)",
                                textFontSize: 14,
                            }
                        }
                    }
                },
                ctrls: {
                    cancelButton: {
                        backgroundColor: ["#212121", "rgb(242, 62, 26)"],
                        disabledBackgroundColor: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"],
                    },
                    confirmButton: {
                        backgroundColor: ["#30a02a", "#30a02a"],
                        disabledBackgroundColor: ["rgba(255,255,255, 0.075)", "rgba(255,255,255, 0.005)"],
                    }
                }
            },
            modifiers: {
                backgroundColor: "#000",
                nameColor: "rgba(255,255,255,0.75)",
                nameFontSize: 32,
                descriptionColor: "rgba(255,255,255,0.5)",
                descriptionFontSize: 14,
                price: {
                    borderColor: "rgba(255,255,255,0.5)",
                    textColor: "rgba(255,255,255,0.75)",
                    textFontSize: 48,
                },
                group: {
                    nameColor: "rgba(255,255,255,0.75)",
                    descriptionColor: "rgba(255,255,255,0.75)",
                    descriptionInvalidColor: "#ff4e4e",
                    buttonPrevious: {
                        backgroundColor: "#30a02a",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(255,255,255,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        textFontSize: 26,
                        disabledTextColor: "rgba(255,255,255,0.1)",
                    },
                    buttonNext: {
                        backgroundColor: "#30a02a",
                        disabledBackgroundColor: "transparent",
                        borderColor: "transparent",
                        disabledBorderColor: "rgba(255,255,255,0.1)",
                        textColor: "rgba(255,255,255,1)",
                        textFontSize: 26,
                        disabledTextColor: "rgba(255,255,255,0.1)",
                    },
                    indicator: {
                        currentValidColor: "#30a02a",
                        currentInvalidColor: "#ff4e4e",
                        otherColor: "rgba(255,255,255,0.25)",
                    }
                },
                item: {
                    backgroundColor: "transparent",
                    nameColor: "rgba(255,255,255,0.75)",
                    nameFontFontSize: 20,
                    descriptionColor: "rgba(255,255,255,0.5)",
                    descriptionFontSize: 12,
                    discount: {
                        backgroundColor: "red",
                        textColor: "white",
                        textFontSize: 12,
                    },
                    quantitySwitch: {
                        on: {
                            backgroundColor: "#30a02a",
                            borderColor: "#30a02a",
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 16,
                        },
                        off: {
                            backgroundColor: "transparent",
                            borderColor: "rgba(255,255,255,0.75)",
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 16,
                        },
                    },
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "transparent",
                            selectedBackgroundColor: "#30a02a",
                            disabledBackgroundColor: "transparent",
                            disabledSelectedBackgroundColor: "#30a02a40",
                            borderColor: "rgba(255,255,255,0.75)",
                            selectedBorderColor: "transparent",
                            disabledBorderColor: "rgba(255,255,255,0.75)",
                            disabledSelectedBorderColor: "transparent",
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 16,
                            selectedTextColor: "rgba(255,255,255,1)",
                            disabledTextColor: "rgba(255,255,255,0.75)",
                            disabledSelectedTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 16,
                        }
                    }
                }
            },
            confirmation: {
                backgroundColor: "#000",
                backButton: {
                    backgroundColor: "#212121",
                    textColor: "#ffffff",
                    textFontSize: 16,
                },
                nextButton: {
                    backgroundColor: "#30a02a",
                    textColor: "#ffffff",
                    textFontSize: 16,
                },
                summaryPrice: {
                    textColor: "#ffffff",
                    textFontSize: 16,
                },
                nestedItem: {
                    backgroundColor: "transparent",
                    nameColor: "rgba(255,255,255,0.5)",
                    price: {
                        textColor: "rgba(255,255,255,0.5)",
                        textFontSize: 12,
                    },
                },
                item: {
                    backgroundColor: "transparent",
                    oddBackgroundColor: "rgba(255,255,255,0.05)",
                    nameColor: "rgba(255,255,255,0.75)",
                    nameFontSize: 20,
                    price: {
                        textColor: "rgba(255,255,255,0.75)",
                        textFontSize: 24,
                    },
                    quantityStepper: {
                        buttons: {
                            backgroundColor: "#30a02a",
                            disabledBackgroundColor: "#30a02a40",
                            borderColor: "rgba(255,255,255,0.75)",
                            disabledBorderColor: "rgba(255,255,255,0.75)",
                            textColor: "rgba(255,255,255,1)",
                            textFontSize: 16,
                            disabledTextColor: "rgba(255,255,255,0.75)",
                        },
                        indicator: {
                            textColor: "rgba(255,255,255,0.75)",
                            textFontSize: 16,
                        }
                    }
                }
            },
            payStatus: {
                primaryMessageColor: "rgba(255,255,255,0.75)",
                primaryMessageFontSize: 40,
                secondaryMessageColor: "rgba(255,255,255,0.5)",
                secondaryMessageFontSize: 20,
            },
            payConfirmation: {
                numberColor: "rgba(255,255,255,1)",
                nameFontSize: 76,
                primaryMessageColor: "rgba(255,255,255,0.75)",
                primaryMessageFontSize: 32,
                secondaryMessageColor: "rgba(255,255,255,0.5)",
                secondaryMessageFontSize: 20,
            }
        }
    }
};
