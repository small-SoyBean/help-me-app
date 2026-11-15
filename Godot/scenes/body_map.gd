class_name BodyMap ##idk why i need this
extends Control

@export var zoom_level: float = 2.4
@export var zoom_duration: float = 0.45
@export var focus_screen_x_ratio: float = 0.5

var _default_pos: Vector2
var _default_scale: Vector2
var _focused_part: TextureButton = null ##will probably work on this later
var _part_centers: Dictionary = {}

## Called when the node enters the scene tree for the first time.
func _ready() -> void:
	_default_pos = position
	_default_scale = scale
		

##call from main.gd during setup to cache each limb's visible pixel center
func register_part_center(button: TextureButton, image: Image) -> void:
	var used_rect := Rect2(image.get_used_rect())
	var tex_size := Vector2(image.get_size())
	if tex_size.x > 0 and tex_size.y > 0 and used_rect.has_area():
		_part_centers[button] = used_rect.get_center() / tex_size
	else:
		_part_centers[button] = Vector2(0.5,0.5)
## toggles zoom on the clicked part, but will need to fix for when i implement more body parts
func toggle_focus(button : TextureButton) -> void:
	if _focused_part == button:
		reset_zoom()
	else:
		focus_on_part(button)

func focus_on_part(button: TextureButton) -> void:
	_focused_part = button
	var normalized_center: Vector2 = _part_centers.get(button, Vector2(0.5,0.5))
	
	var btn_size := button.size
	var tex_size := button.texture_normal.get_size() if button.texture_normal else btn_size
	var scale_ratio := minf(btn_size.x / tex_size.x, btn_size.y / tex_size.y)
	var drawn_size := tex_size * scale_ratio
	var drawn_offset := (btn_size - drawn_size) / 2.0
	
	var limb_local_pos := button.position + drawn_offset + (normalized_center * drawn_size)
	
	var viewport_size := get_viewport_rect().size
	var target_screen_point := Vector2(viewport_size.x * focus_screen_x_ratio, viewport_size.y * 0.5)
	var target_scale := Vector2(zoom_level, zoom_level)
	
	pivot_offset = Vector2.ZERO
	var target_pos := target_screen_point - (limb_local_pos * target_scale)
	print("btn_size: ", btn_size, " | limb_local: ", limb_local_pos, " | target_pos: ", target_pos, " | viewport: ", viewport_size)
	_animate_to(target_pos, target_scale)
	
func reset_zoom() -> void:
	_focused_part = null
	_animate_to(_default_pos, _default_scale)
	
func _animate_to(target_pos: Vector2, target_scale: Vector2) -> void:
	var tween:= create_tween().set_parallel(true).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "position", target_pos, zoom_duration)
	tween.tween_property(self, "scale", target_scale, zoom_duration)

func _input(event: InputEvent) -> void:
	if _focused_part != null:
		if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
			reset_zoom()
		elif event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
			# Only reset if the mouse is NOT hovering over any of the body part buttons
			if get_viewport().gui_get_hovered_control() == null or not (get_viewport().gui_get_hovered_control() is TextureButton):
				reset_zoom()
	
