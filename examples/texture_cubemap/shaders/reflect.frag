// adapted from https://github.com/SaschaWillems/Vulkan/blob/master/data/shaders/glsl/texturecubemap/reflect.frag
#version 450

layout (binding = 1) uniform samplerCube samplerColor;

layout (binding = 0) uniform UBO
{
	mat4 projection;
	mat4 model;
	mat4 invModel;
	float lodBias;
} ubo;

layout (location = 0) in vec3 inPos;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec3 inViewVec;
layout (location = 3) in vec3 inLightVec;

layout (location = 0) out vec4 outFragColor;

void main()
{
	vec3 cI = normalize (inPos);
	vec3 cR = reflect (cI, normalize(inNormal));

	// Convert world coordinates to cubemap coordinate space
	// the inverse model-view matrix already deals with the transformation from right-handed to left-handed coordinates
	cR = vec3(ubo.invModel * vec4(cR, 0.0));

	vec4 color = texture(samplerColor, cR, ubo.lodBias);

	vec3 N = normalize(inNormal);
	vec3 L = normalize(inLightVec);
	vec3 V = normalize(inViewVec);
	vec3 R = reflect(-L, N);
	vec3 ambient = vec3(0.5) * color.rgb;
	vec3 diffuse = max(dot(N, L), 0.0) * vec3(1.0);
	vec3 specular = pow(max(dot(R, V), 0.0), 16.0) * vec3(0.5);
	outFragColor = vec4(ambient + diffuse * color.rgb + specular, 1.0);
}
