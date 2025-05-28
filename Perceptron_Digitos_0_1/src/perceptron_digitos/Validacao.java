package perceptron_digitos;

public class Validacao {

    public Validacao() {
    }

    public double somatorio(int[][] mat, double[] w) {
        double yent = 0;
        double[] entrada = new double[16];
        int l = 0;
        for (int i = 0; i < 5; i++)
            for (int j = 0; j < 3; j++)
                entrada[l++] = mat[i][j];
        entrada[l] = 1; // bias (posição 15)

        for (int i = 0; i < 16; i++)
            yent += entrada[i] * w[i];

        return yent;
    }

    public double saida(double yent, double limiar) {
        if (yent > limiar)
            return 1;
        if (yent < -limiar)
            return -1;
        return 0;
    }

    public String teste(int[][] mat, double[][] w, double[][] t, double limiar) {
        for (int i = 0; i < w.length; i++) {
            double yent = somatorio(mat, w[i]);
            double f = saida(yent, limiar);
            // Supondo que a saída esperada para cada perceptron i esteja em t[i][0]
            if (f == t[i][i]) {
                return String.valueOf(i);
            }
        }
        return "?";
    }

}
