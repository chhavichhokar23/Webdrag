import InputElement from "./InputElement"
import InputPreview from "./InputElement/preview"
import { inputConfig } from "./InputElement/config"

import ButtonElement from "./ButtonElement"
import ButtonPreview from "./ButtonElement/preview"
import { buttonConfig } from "./ButtonElement/config"

import TextElement from "./TextElement"
import TextPreview from "./TextElement/preview"
import { textConfig } from "./TextElement/config"

import ImageElement from "./ImageElement"
import ImagePreview from "./ImageElement/preview"
import { imageConfig } from "./ImageElement/config"

import IconElement from "./IconElement"
import IconPreview from "./IconElement/preview"
import { iconConfig } from "./IconElement/config"

import ShapeElement from "./ShapeElement"
import ShapePreview from "./ShapeElement/preview"
import { shapeConfig } from "./ShapeElement/config"

export const elementRegistry = {
  text: {
    component: TextElement,
    preview: TextPreview,        
    config: textConfig,
    label: "Text",
  },
  input: {
    component: InputElement,
    preview: InputPreview,   
    config: inputConfig,
    label: "Input Box",
  },
  button: {
    component: ButtonElement,
    preview: ButtonPreview, 
    config: buttonConfig,
    label: "Button",
  },
    image: {    
    component: ImageElement,
    preview: ImagePreview, 
    config: imageConfig,
    label: "Image",
  },
  icon: {
    component: IconElement,
    preview: IconPreview,
    config: iconConfig,
    label: "Icon",
  },
  shape: {
    component: ShapeElement,
    preview: ShapePreview,
    config: shapeConfig,
    label: "Shape",
  },
}

export const elementConfig = Object.fromEntries(
  Object.entries(elementRegistry).map(([type, el]) => [type, el.config])
)