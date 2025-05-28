package perceptron_digitos;

public class Aprendizagem {

private final double[][] x = {
    {1,1,1, 1,0,1, 1,0,1, 1,0,1, 1,1,1, 1}, // 0 + bias
    {0,1,0, 1,1,0, 0,1,0, 0,1,0, 1,1,1, 1}, // 1 + bias
    {1,1,1, 0,0,1, 1,1,1, 1,0,0, 1,1,1, 1}, // 2 + bias
    {1,1,1, 0,0,1, 1,1,1, 0,0,1, 1,1,1, 1}, // 3 + bias
    {1,0,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1, 1}, // 4 + bias
    {1,1,1, 1,0,0, 1,1,1, 0,0,1, 1,1,1, 1}, // 5 + bias
    {1,1,1, 1,0,0, 1,1,1, 1,0,1, 1,1,1, 1}, // 6 + bias
    {1,1,1, 0,0,1, 0,1,0, 1,0,0, 1,0,0, 1}, // 7 + bias
    {1,1,1, 1,0,1, 1,1,1, 1,0,1, 1,1,1, 1}, // 8 + bias
    {1,1,1, 1,0,1, 1,1,1, 0,0,1, 0,0,1, 1}  // 9 + bias
};

    private final double[][] w = new double[10][16]; // 10 perceptrons
    private final double[][] t = new double[10][10]; // target matrix
    private int epocas;

    public Aprendizagem() {
        epocas = 0;
        // Prepara a matriz de saída esperada (one-hot)
        for (int i = 0; i < 10; i++) {
            for (int j = 0; j < 10; j++) {
                t[i][j] = (i == j) ? 1 : -1;
            }
        }
    }

    public double[][] getw() {
        return w;
    }

    public double [][] gett(){
        return t;
    } 

    public int getepocas() {
        return epocas;
    }

    public double somatorio(int perceptronIndex, int amostraIndex) {
        double yent = 0;
        for (int j = 0; j < 16; j++) {
            yent += x[amostraIndex][j] * w[perceptronIndex][j];
        }
        return yent;
    }

    public double saida(double yent, double limiar) {
        if (yent > limiar) return 1;
        if (yent < -limiar) return -1;
        return 0;
    }

    public void atualiza(int perceptronIndex, double alfa, int amostraIndex, double f) {
        for (int j = 0; j < 16; j++) {
            w[perceptronIndex][j] += alfa * (t[perceptronIndex][amostraIndex] - f) * x[amostraIndex][j];
        }
    }

    public void algoritmo(double alfa, double limiar) {
        boolean mudou;

        // Zera pesos
        for (int i = 0; i < 10; i++)
            for (int j = 0; j < 16; j++)
                w[i][j] = 0;

        do {
            mudou = false;
            for (int i = 0; i < 10; i++) { // para cada amostra
                for (int p = 0; p < 10; p++) { // para cada perceptron
                    double yent = somatorio(p, i);
                    double f = saida(yent, limiar);
                    if (f != t[p][i]) {
                        atualiza(p, alfa, i, f);
                        mudou = true;
                    }
                }
            }
            epocas++;
        } while (mudou);
    }
}
