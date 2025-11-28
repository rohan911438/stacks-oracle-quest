;; OracleQuest Markets - minimal version

(define-data-var next-id uint u1)

(define-map markets
  ((id uint))
  ((creator principal) (resolved bool) (outcome (optional bool))))

(define-public (create-market)
  (let ((id (var-get next-id)))
    (begin
      (var-set next-id (+ id u1))
      (map-set markets { id: id } { creator: tx-sender, resolved: false, outcome: none })
      (ok id)
    )
  ))

(define-read-only (get-market (id uint))
  (map-get? markets { id: id }))

(define-public (resolve-market (id uint) (outcome bool))
  (match (map-get? markets { id: id })
    market
      (if (and (is-eq tx-sender (get creator market)) (not (get resolved market)))
          (begin
            (map-set markets { id: id } { creator: tx-sender, resolved: true, outcome: (some outcome) })
            (ok outcome)
          )
          (err u1))
    (err u2)))
