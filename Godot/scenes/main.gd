extends Control

func _ready() -> void:
	connect_to_react()

func connect_to_react() -> void:
	ReactBridge.message_received.connect(receive_msg)

func receive_msg(type: String, payload: Variant) -> void:
	$Label.text = "%s\n%s" % [type, JSON.stringify(payload)]
