// Grid configuration
const gridSize = 500;
const cellSize = 50;
const numCells = gridSize / cellSize;

// SVG margins for labels
const margin = {
    top: 20,
    right: 20,
    bottom: 50,  // More space for X-axis labels
    left: 50     // More space for Y-axis labels
};

// Create SVG container with more space for labels
const svg = d3.select("#grid")
    .attr("width", gridSize + margin.left + margin.right)
    .attr("height", gridSize + margin.top + margin.bottom);

// Create a group for the grid and translate it to make room for labels
const gridGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create vertical grid lines
gridGroup.selectAll(".vertical")
    .data(d3.range(numCells + 1))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", d => d * cellSize)
    .attr("y1", 0)
    .attr("x2", d => d * cellSize)
    .attr("y2", gridSize);

// Create horizontal grid lines
gridGroup.selectAll(".horizontal")
    .data(d3.range(numCells + 1))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("y1", d => d * cellSize)
    .attr("x2", gridSize)
    .attr("y2", d => d * cellSize);

// Add X-axis labels with more space
gridGroup.selectAll(".x-label")
    .data(d3.range(numCells + 1))
    .enter()
    .append("text")
    .attr("class", "axis-label")
    .attr("x", d => d * cellSize)
    .attr("y", gridSize + 30)  // Moved down for better visibility
    .attr("text-anchor", "middle")
    .text(d => d);

// Add Y-axis labels with more space
gridGroup.selectAll(".y-label")
    .data(d3.range(numCells + 1))
    .enter()
    .append("text")
    .attr("class", "axis-label")
    .attr("x", -20)  // Moved left for better visibility
    .attr("y", d => d * cellSize)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .text(d => d);

// Create robot with camera
const robotSize = cellSize * 0.8;
const robotGroup = gridGroup.append("g").attr("class", "robot-group");

const robot = robotGroup.append("path")
    .attr("class", "robot")
    .attr("d", d3.symbol().type(d3.symbolTriangle).size(robotSize * 20));

// Add camera to robot (represented as a small rectangle)
const cameraGroup = robotGroup.append("g").attr("class", "camera-group");
const camera = cameraGroup.append("rect")
    .attr("class", "camera")
    .attr("width", cellSize * 0.2)
    .attr("height", cellSize * 0.1)
    .attr("x", -cellSize * 0.1)  // Center the rectangle
    .attr("y", -cellSize * 0.05)  // Center vertically
    .style("fill", "#00ff00");

// Add direction indicator to camera
cameraGroup.append("path")
    .attr("d", `M ${cellSize * 0.1} 0 L ${cellSize * 0.2} 0`)
    .style("stroke", "#00ff00")
    .style("stroke-width", 2);

// Create AprilTag with target
const tagSize = cellSize * 0.6;
const tagGroup = gridGroup.append("g").attr("class", "tag-group");

const aprilTag = tagGroup.append("rect")
    .attr("class", "apriltag")
    .attr("width", tagSize)
    .attr("height", tagSize)
    .attr("x", -tagSize/2)
    .attr("y", -tagSize/2);

// Add target to AprilTag
const targetGroup = tagGroup.append("g").attr("class", "target-group");
const target = targetGroup.append("g").attr("class", "target");
target.append("circle")
    .attr("r", tagSize * 0.2)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", "none")
    .style("stroke", "purple")
    .style("stroke-width", 2);
target.append("circle")
    .attr("r", tagSize * 0.1)
    .attr("cx", 0)
    .attr("cy", 0)
    .style("fill", "purple");

const vector = gridGroup.append("line")
    .attr("class", "vector")
    .style("stroke", "#2ecc71")
    .style("stroke-width", 2)
    .style("stroke-dasharray", "5,5");

// Add axis labels with more space
gridGroup.append("text")
    .attr("class", "axis-title")
    .attr("x", gridSize / 2)
    .attr("y", gridSize + 45)  // Moved down for better visibility
    .attr("text-anchor", "middle")
    .text("X Axis");

gridGroup.append("text")
    .attr("class", "axis-title")
    .attr("x", -35)  // Moved left for better visibility
    .attr("y", gridSize / 2)
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90, -35, ${gridSize / 2})`)
    .text("Y Axis");

// Function to update positions and rotations
function updatePositions() {
    const robotX = parseFloat(document.getElementById('robot-x').value);
    const robotY = parseFloat(document.getElementById('robot-y').value);
    const robotRotation = parseFloat(document.getElementById('robot-rotation').value);
    const cameraX = parseFloat(document.getElementById('camera-x').value);
    const cameraY = parseFloat(document.getElementById('camera-y').value);
    const cameraRotation = parseFloat(document.getElementById('camera-rotation').value);
    
    const tagX = parseFloat(document.getElementById('tag-x').value);
    const tagY = parseFloat(document.getElementById('tag-y').value);
    const tagRotation = parseFloat(document.getElementById('tag-rotation').value);
    const targetX = parseFloat(document.getElementById('target-x').value);
    const targetY = parseFloat(document.getElementById('target-y').value);
    const targetRotation = parseFloat(document.getElementById('target-rotation').value);
    
    // Update robot and camera
    robotGroup.attr("transform", `translate(${robotX * cellSize},${robotY * cellSize}) rotate(${robotRotation})`);
    cameraGroup.attr("transform", `translate(${cameraX * cellSize},${cameraY * cellSize}) rotate(${cameraRotation})`);
    
    // Update tag and target
    tagGroup.attr("transform", `translate(${tagX * cellSize},${tagY * cellSize}) rotate(${tagRotation})`);
    targetGroup.attr("transform", `translate(${targetX * cellSize},${targetY * cellSize}) rotate(${targetRotation})`);
    
    updateVector();
}

// Helper function to get position of a point
function getPointPosition(pointType) {
    const robotX = parseFloat(document.getElementById('robot-x').value);
    const robotY = parseFloat(document.getElementById('robot-y').value);
    const robotRotation = parseFloat(document.getElementById('robot-rotation').value);
    const cameraX = parseFloat(document.getElementById('camera-x').value);
    const cameraY = parseFloat(document.getElementById('camera-y').value);
    const cameraRotation = parseFloat(document.getElementById('camera-rotation').value);
    const tagX = parseFloat(document.getElementById('tag-x').value);
    const tagY = parseFloat(document.getElementById('tag-y').value);
    const tagRotation = parseFloat(document.getElementById('tag-rotation').value);
    const targetX = parseFloat(document.getElementById('target-x').value);
    const targetY = parseFloat(document.getElementById('target-y').value);
    const targetRotation = parseFloat(document.getElementById('target-rotation').value);

    switch(pointType) {
        case 'robot':
            return { x: robotX, y: robotY, rotation: robotRotation };
        case 'camera': {
            // Transform camera position relative to robot
            const radians = robotRotation * Math.PI / 180;
            const rotatedX = cameraX * Math.cos(radians) - cameraY * Math.sin(radians);
            const rotatedY = cameraX * Math.sin(radians) + cameraY * Math.cos(radians);
            return { 
                x: robotX + rotatedX,
                y: robotY + rotatedY,
                rotation: robotRotation + cameraRotation
            };
        }
        case 'tag':
            return { x: tagX, y: tagY, rotation: tagRotation };
        case 'target': {
            // Transform target position relative to tag
            const radians = tagRotation * Math.PI / 180;
            const rotatedX = targetX * Math.cos(radians) - targetY * Math.sin(radians);
            const rotatedY = targetX * Math.sin(radians) + targetY * Math.cos(radians);
            return { 
                x: tagX + rotatedX,
                y: tagY + rotatedY,
                rotation: tagRotation + targetRotation
            };
        }
        default:
            return { x: 0, y: 0, rotation: 0 };
    }
}

// Function to update vector and readouts
function updateVector() {
    const source = document.getElementById('vector-source').value;
    const destination = document.getElementById('vector-destination').value;
    
    const sourcePos = getPointPosition(source);
    const destPos = getPointPosition(destination);
    
    // Calculate global vector components
    const globalDeltaX = destPos.x - sourcePos.x;
    const globalDeltaY = destPos.y - sourcePos.y;
    const globalDistance = Math.sqrt(globalDeltaX * globalDeltaX + globalDeltaY * globalDeltaY);
    let globalAngle = Math.atan2(globalDeltaY, globalDeltaX) * (180 / Math.PI);
    globalAngle = (globalAngle + 360) % 360;

    // Calculate local vector components relative to robot
    const robotRotation = parseFloat(document.getElementById('robot-rotation').value);
    const robotRadians = robotRotation * Math.PI / 180;
    const localDeltaX = globalDeltaX * Math.cos(robotRadians) + globalDeltaY * Math.sin(robotRadians);
    const localDeltaY = -globalDeltaX * Math.sin(robotRadians) + globalDeltaY * Math.cos(robotRadians);
    const localDistance = globalDistance;
    const localAngle = (globalAngle - robotRotation + 360) % 360;
    
    // Update vector line
    vector
        .attr("x1", sourcePos.x * cellSize)
        .attr("y1", sourcePos.y * cellSize)
        .attr("x2", destPos.x * cellSize)
        .attr("y2", destPos.y * cellSize);
    
    // Update readouts
    document.getElementById('global-delta-x').textContent = globalDeltaX.toFixed(2);
    document.getElementById('global-delta-y').textContent = globalDeltaY.toFixed(2);
    document.getElementById('global-distance').textContent = globalDistance.toFixed(2);
    document.getElementById('global-angle').textContent = globalAngle.toFixed(1);

    document.getElementById('local-delta-x').textContent = localDeltaX.toFixed(2);
    document.getElementById('local-delta-y').textContent = localDeltaY.toFixed(2);
    document.getElementById('local-distance').textContent = localDistance.toFixed(2);
    document.getElementById('local-angle').textContent = localAngle.toFixed(1);
}

// Function to sync number input with slider
function syncInputs(inputId, sliderId) {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);
    
    input.addEventListener('input', () => {
        slider.value = input.value;
        if (inputId.includes('robot')) {
            updatePositions();
        } else {
            updatePositions();
        }
    });
    
    slider.addEventListener('input', () => {
        input.value = slider.value;
        if (inputId.includes('robot')) {
            updatePositions();
        } else {
            updatePositions();
        }
    });
}

// Add event listeners for all controls
['robot-x', 'robot-y', 'robot-rotation', 
 'camera-x', 'camera-y', 'camera-rotation',
 'tag-x', 'tag-y', 'tag-rotation',
 'target-x', 'target-y', 'target-rotation'].forEach(id => {
    document.getElementById(id).addEventListener('input', updatePositions);
});

// Add event listeners for sliders
['robot-x', 'robot-y', 'tag-x', 'tag-y'].forEach(id => {
    syncInputs(id, id + '-slider');
});

// Add event listeners for vector source/destination
document.getElementById('vector-source').addEventListener('change', updateVector);
document.getElementById('vector-destination').addEventListener('change', updateVector);

// Initial update
updatePositions(); 