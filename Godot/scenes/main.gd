extends Control
@onready var body_map: Control = $body_map
const NORMAL_COLOR := Color(1.0, 1.0, 1.0, 1.0) #normal black silhouette
const HOVER_COLOR := Color(1.0, 1.0, 1.0, 0.6) #white silhouette for hovering

func _ready() -> void:
	for child in body_map.find_children("*","TextureButton", true, false):
		if child is TextureButton:
			_setup_body_part(child)
			child.self_modulate = NORMAL_COLOR
			child.pressed.connect(_on_body_part_pressed.bind(child))
			child.mouse_entered.connect(_on_part_hovered.bind(child, true))
			child.mouse_exited.connect(_on_part_hovered.bind(child,false))
	connect_to_react()
	
#makes a click mask that aligns to the pixels of the body part	
func _setup_body_part(button : TextureButton) -> void:
	if button.texture_normal:
		var image := button.texture_normal.get_image()
		var bitmap := BitMap.new()
		bitmap.create_from_image_alpha(image)
		button.texture_click_mask = bitmap	
		
		body_map.register_part_center(button,image)
#for tha hover color!!!!
func _on_part_hovered(button: TextureButton, is_hovered: bool) -> void:
	var target_color_hover := HOVER_COLOR if is_hovered else NORMAL_COLOR
	var tween_hover := create_tween()
	tween_hover.tween_property(button, "self_modulate", target_color_hover, .15)
	
func _on_body_part_pressed(button: TextureButton) -> void:
	body_map.toggle_focus(button)
	print("clicked; ", button.name)
	$Label.text = "clicked: " + button.name #for reactbridge

func connect_to_react() -> void:
	ReactBridge.message_received.connect(receive_msg)

func receive_msg(type: String, payload: Variant) -> void:
	$Label.text = "%s\n%s" % [type, JSON.stringify(payload)]
