# Perceptron para porta AND bipolar
entradas = [
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 1]
]
saidas_desejadas = [-1, -1, -1, 1]

# Pesos iniciais
pesos = [0, 0, 0]
taxa_aprendizado = 1
limiar = 0.2
epoca = 0
aprendizado_completo = False

def func_ativacao(u):
    return 1 if u >= 0 else -1

while not aprendizado_completo:
    epoca += 1
    erro_total = 0
    print(f"\nÉpoca {epoca}")
    
    for i in range(len(entradas)):
        x = entradas[i]
        d = saidas_desejadas[i]
        
        # Soma ponderada
        u = sum([x[j] * pesos[j] for j in range(3)])
        y = func_ativacao(u)
        
        erro = d - y
        erro_total += abs(erro)
        
        # Atualiza pesos
        for j in range(3):
            pesos[j] += taxa_aprendizado * erro * x[j]
        
        print(f"x: {x[1:]}, u: {u}, y: {y}, d: {d}, erro: {erro}, pesos: {pesos}")
    
    if erro_total == 0:
        aprendizado_completo = True

print("\nTreinamento finalizado.")
print("Pesos finais:", pesos)
