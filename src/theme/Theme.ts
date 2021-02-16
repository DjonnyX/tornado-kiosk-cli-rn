import { IKioskTheme } from "@djonnyx/tornado-types";

export const theme: IKioskTheme = {
    name: "dark",
    themes: {
        ["light"]: {
            common: {
                modal: {
                    background: "#fff",
                    window: {
                        background: "#fff",
                    }
                },
                modalTransparent: {
                    background: "rgba(255,255,255,0.75)",
                    window: {
                        background: "#fff",
                        borderColor: "rgba(0,0,0,0.1)"
                    }
                },
                modalNotification: {
                    background: "none",
                    window: {
                        background: "rgba(0,0,0,0.75)",
                        borderColor: "rgba(0,0,0,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            languageModal: {
                item: {
                    borderColor: "rgba(0,0,0,0.15)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            orderTypeModal: {
                item: {
                    borderColor: "rgba(0,0,0,0.15)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            loading: {
                background: "#fff",
                progressBar: {
                    thumbColor: "rgba(0,0,0,0.85)",
                    trackColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            intro: {
                background: "#fff",
            },
            menu: {
                background: "#fff",
                header: {
                    background: ["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 0)"],
                    titleColor: "rgba(0,0,0,0.75)",
                },
                backButton: {
                    iconColor: "rgba(0,0,0,0.75)",
                },
                sideMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                    },
                },
                navMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                        descriptionColor: "rgba(0,0,0,0.5)",
                        price: {
                            borderColor: "rgba(0,0,0,0.5)",
                            textColor: "rgba(0,0,0,0.5)",
                        }
                    }
                },
                orderType: {
                    borderColor: "rgba(0,0,0,0.75)",
                    textColor: "rgba(0,0,0,0.75)",
                },
                sum: {
                    description: {
                        textColor: "rgba(0,0,0,0.75)"
                    },
                    price: {
                        textColor: "rgba(0,0,0,0.75)"
                    },
                },
                draftOrder: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(0,0,0,0.75)",
                        price: {
                            borderColor: "rgba(0,0,0,0.5)",
                            textColor: "rgba(0,0,0,0.5)",
                        },
                        quantityStepper: {
                            buttons: {
                                borderColor: "rgba(0,0,0,0.75)",
                                textColor: "rgba(0,0,0,0.75)",
                            },
                            indicator: {
                                textColor: "rgba(0,0,0,0.75)",
                            }
                        }
                    }
                },
                ctrls: {
                    cancelButton: {
                        backgroundColor: ["rgb(49, 211, 48)", "rgb(126, 216, 59)"],
                        disabledBackgroundColor: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"],
                    },
                    confirmButton: {
                        backgroundColor: ["rgb(240, 30, 26)", "rgb(242, 62, 26)"],
                        disabledBackgroundColor: ["rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.1)"],
                    }
                }
            },
            myOrder: {
                background: "#fff",
            },
        },
        ["dark"]: {
            common: {
                modal: {
                    background: "#000",
                    window: {
                        background: "#000",
                    }
                },
                modalTransparent: {
                    background: "rgba(0,0,0,0.75)",
                    window: {
                        background: "#000",
                        borderColor: "rgba(255,255,255,0.1)"
                    }
                },
                modalNotification: {
                    background: "none",
                    window: {
                        background: "rgba(255,255,255,0.75)",
                        borderColor: "rgba(255,255,255,0.1)",
                    }
                },
                notificationAlert: {
                    textColor: "rgba(0,0,0,0.75)",
                }
            },
            languageModal: {
                item: {
                    borderColor: "rgba(255,255,255,0.15)",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            orderTypeModal: {
                item: {
                    borderColor: "rgba(255,255,255,0.15)",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            loading: {
                background: "#000",
                progressBar: {
                    thumbColor: "rgba(255,255,255,0.85)",
                    trackColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                }
            },
            intro: {
                background: "#000",
            },
            menu: {
                background: "#000",
                header: {
                    background: ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"],
                    titleColor: "rgba(255,255,255,0.75)",
                },
                backButton: {
                    iconColor: "rgba(255,255,255,0.75)",
                },
                sideMenu: {
                    item: {
                        backgroundColor: "#fff",
                        nameColor: "rgba(255,255,255,0.75)",
                    },
                },
                navMenu: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(255,255,255,0.75)",
                        descriptionColor: "rgba(255,255,255,0.5)",
                        price: {
                            borderColor: "rgba(255,255,255,0.5)",
                            textColor: "rgba(255,255,255,0.5)",
                        }
                    }
                },
                orderType: {
                    borderColor: "rgba(255,255,255,0.75)",
                    textColor: "rgba(255,255,255,0.75)",
                },
                sum: {
                    description: {
                        textColor: "rgba(255,255,255,0.75)"
                    },
                    price: {
                        textColor: "rgba(255,255,255,0.75)"
                    },
                },
                draftOrder: {
                    item: {
                        backgroundColor: "transparent",
                        nameColor: "rgba(255,255,255,0.75)",
                        price: {
                            borderColor: "rgba(255,255,255,0.5)",
                            textColor: "rgba(255,255,255,0.5)",
                        },
                        quantityStepper: {
                            buttons: {
                                borderColor: "rgba(255,255,255,0.75)",
                                textColor: "rgba(255,255,255,0.75)",
                            },
                            indicator: {
                                textColor: "rgba(255,255,255,0.75)",
                            }
                        }
                    }
                },
                ctrls: {
                    cancelButton: {
                        backgroundColor: ["rgb(240, 30, 26)", "rgb(242, 62, 26)"],
                        disabledBackgroundColor: ["rgba(255,255,255, 0.15)", "rgba(255,255,255, 0.1)"],
                    },
                    confirmButton: {
                        backgroundColor: ["rgb(49, 211, 48)", "rgb(126, 216, 59)"],
                        disabledBackgroundColor: ["rgba(255,255,255, 0.15)", "rgba(255,255,255, 0.1)"],
                    }
                }
            },
            myOrder: {
                background: "#000",
            },
        }
    }
};
