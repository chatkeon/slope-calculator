export interface Slider {
  min: number;
  max: number;
  step: number;
}

export interface Settings {
  slider: {
    y1: Slider;
    y2: Slider;
    x: Slider;
    slope: Slider;
  };

  table: {
    precision: number;
    step: number;
  }
}
