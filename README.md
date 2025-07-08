# Welcome to API

Client A ----> Server Instance A
                 |
                 |   <-- Redis PUB (message, status)
                 V
              Redis
                 ^
                 |   <-- Redis SUB (message, status)
                 |
Client B ----> Server Instance B
