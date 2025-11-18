;; OracleQuest Markets - enhanced version

;; Versioning
(define-constant CONTRACT-VERSION u2)

;; Error codes
(define-constant ERR-ALREADY-EXISTS u100)
(define-constant ERR-NOT-FOUND u101)
(define-constant ERR-UNAUTHORIZED u102)
(define-constant ERR-ALREADY-RESOLVED u103)
(define-constant ERR-TOO-EARLY u104)
(define-constant ERR-ADMIN-ALREADY-SET u105)

;; Admin is optional and must be set after deploy (no constructors in Clarity)
(define-data-var admin (optional principal) none)

;; Auto-increment id helper for convenience market creation
(define-data-var next-id uint u1)

;; Market storage
;; id -> { creator, resolved, outcome, end-block, question }
(define-map markets
  ((id uint))
  ((creator principal)
   (resolved bool)
   (outcome (optional bool))
   (end-block uint)
   (question (string-utf8 200))))

;; =============== Helpers ===============
(define-read-only (get-version)
  CONTRACT-VERSION)

(define-read-only (get-admin)
  (var-get admin))

(define-private (is-admin (p principal))
  (match (var-get admin)
    admin-p (is-eq admin-p p)
    false))

;; =============== Admin ===============
;; Can be called only once to set initial admin, or later by the current admin to rotate
(define-public (set-admin (p principal))
  (begin
    (match (var-get admin)
      current
        (if (or (is-none current) (is-admin tx-sender))
            (begin (var-set admin (some p)) (ok p))
            (err ERR-UNAUTHORIZED))
    )
  ))

;; =============== Creation ===============
;; Basic creation preserving original interface (end-block u0, question "")
(define-public (create-market (id uint))
  (begin
    (if (map-get? markets { id: id })
        (err ERR-ALREADY-EXISTS)
        (begin
          (map-set markets { id: id }
            { creator: tx-sender, resolved: false, outcome: none, end-block: u0, question: "" })
          (print { event: "market-created", id: id, creator: tx-sender })
          (ok id)
        )
    )
  ))

;; Advanced creation with end-block and question
(define-public (create-market-advanced (id uint) (end-block uint) (question (string-utf8 200)))
  (begin
    (if (map-get? markets { id: id })
        (err ERR-ALREADY-EXISTS)
        (begin
          (map-set markets { id: id }
            { creator: tx-sender, resolved: false, outcome: none, end-block: end-block, question: question })
          (print { event: "market-created", id: id, creator: tx-sender, end: end-block })
          (ok id)
        )
    )
  ))

;; Auto id creation
(define-public (create-market-auto (end-block uint) (question (string-utf8 200)))
  (let ((id (var-get next-id)))
    (begin
      (var-set next-id (+ id u1))
      (map-set markets { id: id }
        { creator: tx-sender, resolved: false, outcome: none, end-block: end-block, question: question })
      (print { event: "market-created", id: id, creator: tx-sender, end: end-block })
      (ok id)
    )
  ))

;; =============== Read ===============
(define-read-only (get-market (id uint))
  (map-get? markets { id: id }))

;; =============== Resolution ===============
(define-public (resolve-market (id uint) (outcome bool))
  (begin
    (match (map-get? markets { id: id })
      market
        (if (get resolved market)
            (err ERR-ALREADY-RESOLVED)
            (let ((can-resolve (or (is-admin tx-sender) (is-eq tx-sender (get creator market))))
                  (end (get end-block market)))
              (if (not can-resolve)
                  (err ERR-UNAUTHORIZED)
                  (if (and (> end u0) (< block-height end))
                      (err ERR-TOO-EARLY)
                      (begin
                        (map-set markets { id: id }
                          { creator: (get creator market), resolved: true, outcome: (some outcome), end-block: end, question: (get question market) })
                        (print { event: "market-resolved", id: id, outcome: outcome, resolver: tx-sender })
                        (ok outcome)
                      )
                  )
              )
            )
        )
      (err ERR-NOT-FOUND)
    )
  ))
