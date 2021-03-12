<?php

namespace App\Controller;

use TypeError;
use App\Entity\Publication;
use App\Form\PublicationType;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PublicationRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;


/**
 * @Route("/api/publication")
 */
class PublicationController extends AbstractController
{
    /**
     * @Route("/", name="publication_index", methods={"GET"})
     */
    public function index(PublicationRepository $publicationRepository): Response
    {
        $data = $publicationRepository->findBy([],["id"=>"DESC"]);
        return $this->json($data);
    }

    /**
     * @Route("/new", name="publication_new", methods={"POST"})
     */
    public function new(Request $request, ValidatorInterface $validator, EntityManagerInterface $entityManager,SluggerInterface $slugger): Response
    {
        $pub = new Publication;
        $brochureFile = $request->files->get("file");
        if($brochureFile!=null){
            $originalFilename = pathinfo($brochureFile->getClientOriginalName(), PATHINFO_FILENAME);
            // this is needed to safely include the file name as part of the URL
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$brochureFile->guessExtension();
            try {
                $brochureFile->move(
                    $this->getParameter('brochures_directory'),
                    $newFilename
                );
            } catch (FileException $e) {
                // ... handle exception if something happens during file upload
            }
            $pub->setImageFilename($newFilename);
        }
        try {
            // $pub = $serializerInterface->deserialize($this->json($request->request),Publication::class,"json");
            // //return $this->json($request->getContent());
            // dd($pub);

            $pub->setTitle( $request->request->get("title"));
            $pub->setDescription( $request->request->get("description"));

            $errors = $validator->validate($pub);
            if(count($errors) > 0) {
                return $this->json([
                    "status" => 401,
                    "message" => "Invalid informations"
                ],401);
            }

            $entityManager->persist($pub);
            $entityManager->flush();
            return $this->json([
                "status" => 200,
                "message" => "Success"
            ],200);
        } catch (NotEncodableValueException $th) {
            return $this->json([
                "status" => 400,
                "message" => "Not encodable value"
            ],400);
        }
    }

    /**
     * @Route("/{id}", name="publication_show", methods={"GET"})
     */
    public function show($id, PublicationRepository $publicationRepository): Response
    {
        $pub = $publicationRepository->findOneBy(array('id' => $id));
        return $this->json($pub);
    }

    /**
     * @Route("/{id}/edit", name="publication_edit", methods={"PUT"})
     */
    public function edit(Request $request,  $id, PublicationRepository $publicationRepository,ValidatorInterface $validator,SerializerInterface $serializerInterface, EntityManagerInterface $entityManager): Response
    {
        $pub = $publicationRepository->findOneBy(array('id' => $id));
        if($pub==null){
            return $this->json([
                "status" => 400,
                "message" => "Publication not found"
            ],400);
        }
        try {
            $tmp = $serializerInterface->deserialize($request->getContent(),Publication::class,"json");

            $pub->setTitle($tmp->getTitle());
            $pub->setDescription($tmp->getDescription());
            $errors = $validator->validate($pub);
            if(count($errors) > 0) {
                return $this->json([
                    "status" => 401,
                    "message" => "Invalid informations"
                ],401);
            }
            $entityManager->persist($pub);
            $entityManager->flush();
            return $this->json([
                "status" => 200,
                "message" => "Success"
            ],200);
        } catch (NotEncodableValueException $th) {
            return $this->json([
                "status" => 400,
                "message" => "Not encodable value"
            ],400);
        }
    }

    /**
     * @Route("/{id}", name="publication_delete", methods={"DELETE"})
     */
    public function delete(Request $request, $id, EntityManagerInterface $entityManager, PublicationRepository $publicationRepository): Response
    {
        $pub = $publicationRepository->findOneBy(array('id' => $id));
        if($pub==null){
            return $this->json([
                "status" => 400,
                "message" => "Publication not found"
            ],400);
        }
        if($pub->getImageFileName()){
            $deleted = unlink($this->getParameter('brochures_directory')."/".($pub->getImageFileName()));
            $pub->setImageFileName(null);
        }
        $entityManager->remove($pub);
        $entityManager->flush();
        return $this->json([
            "status" => 200,
            "message" => "delete success"
        ],200);
    }
}
