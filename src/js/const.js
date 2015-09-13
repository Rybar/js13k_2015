var G = window.G || {};
G.ALL = []; //to store all collidable entities in the game
G.PARTICLES = [];

G.const={
    GRID: 24,
    WIDTH: 50,
    HEIGHT: 40,
    VIEW_X: 800,
    VIEW_Y: 600,
    
    P_SIZE: 16,
    P_SPEED: 0.03,
    P_SPACESPEED: 0.01,
    P_THRUST: 0.003,
    P_FRICTX: 0.9,
    P_FRICTY: 0.94,
    P_SPACEFRICT: 1,
    P_GRAVITY: 0.02,
    P_JUMP: 0.5,
    
    
    E_SIZE: 16,
    E_SPEED: 0.02,
    E_SPACESPEED: 0.007,
    E_THRUST: 0.003,
    E_FRICTX: 1,
    E_FRICTY: 1,
    E_SPACEFRICT: 1,
    E_GRAVITY: 0.00,
    E_JUMP: 0.5,
    E_HUNGER: 800
};