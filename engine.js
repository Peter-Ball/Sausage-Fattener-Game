/*This is a fixed time step game loop. It is adapted from
code by Frank Poth. It is meant to be used for any game, and
makes sure the game state is updated at the same rate across
different devices.
*/

class engine{
  constructor(time_step, update, render){

    this.accumulated_time        = 0; //Time accumulated since last update
    this.animation_frame_request = undefined;
    this.time                    = undefined; //The most recent timestamp executed
    this.time_step               = time_step; //Duration of a step. 1000/x = x frames/sec
  
    this.updated = false; //Was the update function called since last cycle?

    this.update = update;
    this.render = render;

    this.handleRun = (time_step) => { this.run(time_step); };
  }

  run(time_stamp) {// a cycle of the game loop.

    this.accumulated_time += timestamp - this.time;
    this.time = time_stamp;

    /*Taken from Frank Poth:
    If the device is too slow, updates may take longer than our time step. If
    this is the case, it could freeze the game and overload the cpu. To prevent this,
    we catch a memory spiral early and never allow three full frames to pass without
    an update. This is not ideal, but at least the user won't crash their cpu.*/

    if (this.accumulated_time >= this.time_step * 3){
      this.accumulated_time = this.time_step;
    }

    /*We can only update the screen when the screen is ready to draw and
    requestAnimationFrame calls the run function. We must keep track of how much time has passed.
    We want to update every time we have accumulated one time step's worth of time,
    and if multiple time steps have accumulated, we must update one time for each of them
    to stay up to speed.*/
    while(this.accumulated_time >= this.time_step){

      this.accumulated_time -= this.time_step;

      this.update(time_stamp);
      this.updated = true; //The gamestate has been updated, keep track for next bit
    }

    //Render if there was an update
    if (this.updated) {

      this.updated = false;
      this.render(time_stamp);
    }

    this.animation_frame_request = window.requestAnimationFrame(this.handleRun());
  }

  start() {
    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame(this.handleRun);
  }

  stop() {
    window.cancelAnimationFrame(this.animation_frame_request);
  }


  
}