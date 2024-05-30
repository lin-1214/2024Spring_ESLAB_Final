// Define the rotation matrix using yaw, pitch, and roll
function rotationMatrix(yaw: number, pitch: number, roll: number): number[][] {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);

    const Rz = [
        [cy, -sy, 0],
        [sy, cy, 0],
        [0, 0, 1],
    ];

    const Ry = [
        [cp, 0, sp],
        [0, 1, 0],
        [-sp, 0, cp],
    ];

    const Rx = [
        [1, 0, 0],
        [0, cr, -sr],
        [0, sr, cr],
    ];

    const Rzy = multiplyMatrices(Rz, Ry);
    const R = multiplyMatrices(Rzy, Rx);
    return R;
}

// Function to multiply two matrices
function multiplyMatrices(A: number[][], B: number[][]): number[][] {
    const result: number[][] = Array(A.length)
        .fill(0)
        .map(() => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

// Function to multiply a matrix by a vector
function multiplyMatrixVector(matrix: number[][], vector: number[]): number[] {
    const result: number[] = Array(matrix.length).fill(0);
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < vector.length; j++) {
            result[i] += matrix[i][j] * vector[j];
        }
    }
    return result;
}

// Objective function to minimize
function objectiveFunction(params: number[], data: number[][], expected: number[]): number {
    const [yaw, pitch, roll] = params;
    const R = rotationMatrix(yaw, pitch, roll);

    let error = 0;
    data.forEach((point) => {
        const rotatedPoint = multiplyMatrixVector(R, point);
        error += rotatedPoint.reduce(
            (sum, value, index) => sum + Math.pow(value - expected[index], 2),
            0
        );
    });

    return error / data.length;
}

// Optimization function (simple grid search for demonstration)
function optimize(data: number[][], expected: number[]): number[] {
    let minError = Number.MAX_VALUE;
    let bestParams: number[] = [0, 0, 0];

    for (let yaw = -Math.PI; yaw <= Math.PI; yaw += 0.1) {
        for (let pitch = -Math.PI / 2; pitch <= Math.PI / 2; pitch += 0.1) {
            for (let roll = -Math.PI; roll <= Math.PI; roll += 0.1) {
                const params = [yaw, pitch, roll];
                const error = objectiveFunction(params, data, expected);
                if (error < minError) {
                    minError = error;
                    bestParams = params;
                }
            }
        }
    }
    console.log("Minimum Error:", minError);
    return bestParams;
}
export { optimize };
// Example usage
const data: number[][] = [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
]; // Replace with your data

const expected: number[] = [0, 0, 1]; // Expected orientation

const optimalParams = optimize(data, expected);

console.log("Optimal Yaw:", optimalParams[0]);
console.log("Optimal Pitch:", optimalParams[1]);
console.log("Optimal Roll:", optimalParams[2]);
